<template>
    <form @submit.prevent="onSubmit">
        <fieldset>
            <div class="form-group">
                <div class="custom-file">
                    <input type="file" class="custom-file-input" id="customFile" accept="video/*,audio/*,image/*" ref="fileContainer" @change="onChangeFile">
                    <label class="custom-file-label" for="customFile" ref="fileLabel">{{ label }}</label>
                </div>
                <div class="my-3 progress">
                    <div class="progress-bar" role="progressbar" v-bind:style="{ width: progress + '%' }" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <div class="my-3 alert alert-primary" v-bind:class="{ 'd-none': null === result }" role="alert">
                    <a v-bind:href="result" target="_blank">{{ result }}</a>
                </div>
            </div>
            <div class="text-right">
                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </fieldset>
    </form>
</template>

<script>
import { uploadService } from './../services';

export default {
    data() {
        return {
            label: 'Choose File',
            file: null,
            progress: 0,
            result: null,
        };
    },
    methods: {
        onSubmit() {
            if (null === this.file) {
                alert('파일을 선택하여 주세요.');
            } else {
                this.progress = 0;
                this.result = null;

                uploadService.chunk(
                    '/api/upload', 
                    this.file, 
                    // onProgress
                    percent => {
                        this.progress = percent;
                    },
                    // onError
                    err => {
                        alert('에러가 발생하였습니다!');
                        console.log(err);
                    },
                    // onSuccess
                    res => {
                        const { data } = res;
                        this.result = data.path;
                    }
                );
            }
        },
        onChangeFile() {
            const file = this.$refs.fileContainer.files;
            this.file = file.length > 0 ? file[0] : null;
            if (null !== this.file) {
                this.label = `${this.file.name}`;
            } else {
                this.label = 'Choose File';
            }
        }
    }
}
</script>
