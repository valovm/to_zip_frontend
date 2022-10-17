<template>
  <form enctype="multipart/form-data" novalidate>
    <label class="btn btn_primary" style="margin-bottom: 6px">
      <input type="file" :name="uploadFieldName"
             @change="filesChange($event.target.name, $event.target.files)"
             fileCount="$event.target.files.length"
             :accept="fileFormats" class="input-file">
      {{ $t('CONVERTER.UPLOAD_BTN') }}
    </label>
    <div class="text-muted"
         v-html="$t('CONVERTER.UPLOAD_FILE.HELP_TEXT', { fileFormats: fileFormatsLabel, sizeLimit: sizeLimit})">
    </div>
    <div class="text-error" v-for="item in uploadErrors">{{ $t('CONVERTER.UPLOADER.ERRORS.' + item.code) }}</div>
  </form>
</template>

<script>
import Api from '@/services/api.service';

const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

export default {
  name: "Upload",
  data() {
    return {
      uploadedFiles: [],
      uploadErrors: [],
      currentStatus: null,
      uploadFieldName: 'file'
    }
  },
  props: {
    onSuccess: {type: Function},
    onError: {type: Function},
    onUploadingStart: {type: Function},
    onUploadingProcess: {type: Function},
    onFailed: {type: Object},
    fileFormats: {type: Array},
    sizeLimit: {type: String}
  },
  computed: {
    fileFormatsLabel() {
      return this.fileFormats.join(', ')
    },
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;

    }
  },
  methods: {
    reset() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL;
      this.uploadedFiles = [];
      this.uploadErrors = [];
    },
    save(formData) {
      // upload data to the server
      this.currentStatus = STATUS_SAVING;

      Api.upload(formData, this.onUploadingProcess,)
          .then(x => {
            this.uploadedFiles = [].concat(x);
            this.currentStatus = STATUS_SUCCESS;
            this.onSuccess(x.data);
          })
          .catch(err => {
            this.uploadErrors = err.response.data.errors
            this.currentStatus = STATUS_FAILED;
            this.onError();
          });
    },
    filesChange(fieldName, fileList) {
      // handle file changes
      const formData = new FormData();

      if (!fileList.length) return;
      const filenames = [];
      // append the files to FormData
      Array
          .from(Array(fileList.length).keys())
          .map(x => {
            const a = fileList[x].name.split('.');
            filenames.push({name: a[0], ext: a[1]});
            formData.append(fieldName, fileList[x], fileList[x].name);
          });
      this.onUploadingStart(filenames);
      // save it
      this.save(formData);
    }
  },
  mounted() {
    this.reset();
  },
}

</script>


<!-- SASS styling -->
<style lang="scss">
.dropbox {
  position: relative;
  cursor: pointer;
}

.input-file {
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
  display: none;
  top: 0;
  left: 0;
}

</style>
