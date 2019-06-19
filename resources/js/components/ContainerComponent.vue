<template>
    <div class="container-fluid">
        <div class="row justify-content-center">
            <div class="col-md-12 my-3">
                <div class="card">
                    <div class="card-header">Chunk Upload by Laravel &amp; Vue</div>
                    <div class="card-body">
                        <uploader-component></uploader-component>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
