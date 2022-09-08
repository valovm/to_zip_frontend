<template>
  <form enctype="multipart/form-data" novalidate>
    <div class="btn btn_primary" style="margin-bottom: 6px">
      <input type="file" multiple :name="uploadFieldName"
             @change="filesChange($event.target.name, $event.target.files)"
             fileCount="$event.target.files.length"
             accept=".rar" class="input-file">
      {{ $t('CONVERTER.UPLOAD_BTN') }}
    </div>
    <div class="text-muted"> {{ $t('CONVERTER.UPLOAD_FILE.HELP_TEXT') }}</div>
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
      uploadError: null,
      currentStatus: null,
      uploadFieldName: 'file'
    }
  },
  props: {
    onSuccess: {type: Function},
    onUploadingStart: {type: Function},
    onFailed: {type: Object},
  },
  computed: {
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
      this.uploadError = null;
    },
    save(formData) {
      // upload data to the server
      this.currentStatus = STATUS_SAVING;

      Api.upload(formData)
          .then(x => {
            this.uploadedFiles = [].concat(x);
            this.currentStatus = STATUS_SUCCESS;
            this.onSuccess(x.data);
          })
          .catch(err => {
            this.uploadError = err.response;
            this.currentStatus = STATUS_FAILED;
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
            console.log(a);
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
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
  display: block;
}

</style>
