import axios from 'axios';

const api = axios.create({
    headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
    }
});

const chunkSize = 1024 * 1024;

const chunkUploader = (endpoint, file, options) => {
    const start = options.chunkNumber * chunkSize;
    const end = Math.min(file.size, start + chunkSize);

    let currentChunkSize = chunkSize;
    if (options.chunkNumber + 1 === options.blockCount) {
        currentChunkSize = file.size - start;
    }

    const params = new FormData();
    params.append('resumableChunkNumber', options.chunkNumber + 1);
    params.append('resumableChunkSize', currentChunkSize);
    params.append('resumableCurrentChunkSize', currentChunkSize);
    params.append('resumableTotalSize', file.size);
    params.append('resumableType', file.type);
    params.append('resumableIdentifier', options.identifier);
    params.append('resumableFilename', file.name);
    params.append('resumableRelativePath', file.name);
    params.append('resumableTotalChunks', options.blockCount);
    params.append('file', file.slice(start, end), file.name);

    return api.post(endpoint, params)
        .then(res => {
            options.onProgress && options.onProgress(parseInt(end / file.size * 100, 10), res);
            if (end === file.size) {
                options.onSuccess && options.onSuccess(res);
            } else {
                options.chunkNumber++;
                return chunkUploader(endpoint, file, options);
            }
        }).catch(err => {
            options.onError && options.onError(err)
        });
};


export default {
    chunk: (endpoint, file, onProgress, onError, onSuccess) => {
        const blockCount = Math.ceil(file.size / chunkSize);
        const chunkNumber = 0;
        const identifier = `${file.size}-${file.name.replace('.', '')}`;

        return chunkUploader(endpoint, file, {
            blockCount,
            identifier,
            chunkNumber,
            onProgress,
            onError,
            onSuccess
        });
    }
}