<template>
  <div class="сonverter">
    <ProgressBarBg :progress="percent" :variant="progressBarVariant"></ProgressBarBg>
    <div class="сonverter__main">
      <template v-if="state === 'START'">
        <Upload :onSuccess="onFileUploaded" :onUploadingStart="onFileUploading"/>
      </template>
      <template v-if="state === 'UPLOADING'">
        <div class="filename">{{ filename }}<b>{{ filename_ext }}</b></div>
        <div class="status">
          <div class="percent">{{ $t("CONVERTER.STATES." + state) }}</div>
        </div>
      </template>
      <template v-if="state === 'ERROR'">
        <div class="filename">{{ filename }}<b>{{ filename_ext }}</b></div>
        <div class="status">
          <div class="text-error">{{ $t("CONVERTER.SOMETHING_WAS_WRONG") }}</div>
        </div>
      </template>
      <template v-if="['UPLOADED', 'PENDING','EXTRACTING', 'COMPRESSING', 'READY'].includes(state)">
        <div class="filename">{{ filename }}<b>{{ filename_ext }}</b></div>
        <div class="status">
          <div class="percent">{{ $t("CONVERTER.STATES." + state) }}</div>
        </div>
        <btn variant="primary" v-if="state === 'READY'" :href="downloadUrl">{{ $t("CONVERTER.DOWNLOAD_BTN") }}</btn>
      </template>
      <div>
        <Btn v-if="['READY', 'ERROR'].includes(state)" :onClick="reset" variant="link_secondary">
          {{ $t('CONVERTER.UPLOAD_AGAIN_BTN') }}
        </Btn>
      </div>
    </div>

  </div>
</template>

<script>
import Api from '@/services/api.service';
import Upload from './ui/Upload.vue';
import ProgressBarBg from '@/components/ui/ProgressBarBg.vue';


function getState(status) {
  const statuses = {
    'pending': 'PENDING',
    'extracting': 'EXTRACTING',
    'compressing': 'COMPRESSING',
    'completed': 'READY',
    'failed': 'ERROR',
  };
  return statuses[status];
}

export default {
  name: "Converter",
  components: {
    Upload, ProgressBarBg
  },
  data: () => ({
    state: 'START',
    filename: null,
    filename_ext: null,
    id: null,
    percent: 0,
    progressBarVariant: 'primary'
  }),
  computed: {
    downloadUrl() {
      return Api.getDownloadLink(this.id);
    },
  },
  watch: {
    id: function (value) {
      if (value) {
        this.runCheckStatus();
      }
    },
    state: function (value) {
      switch (value) {
        case 'START':
          this.percent = 0;
          break;
        case 'UPLOADED':
          this.percent = 20;
          break;
        case 'EXTRACTING':
          this.percent = 40;
          break;
        case 'COMPRESSING':
          this.percent = 60;
          break;
        case 'READY':
          this.percent = 100;
          break;
        case 'ERROR':
          this.error();
          break;
      }
    },
  },
  methods: {
    error() {
      this.percent = 100;
      this.progressBarVariant = 'danger';
    },
    reset() {
      this.percent = 0;
      this.state = 'START';
      localStorage.removeItem('id');
    },
    onFileUploading(filenames) {
      this.state = 'UPLOADING';
      this.filename = filenames[0].name;
      this.filename_ext = `.${filenames[0].ext}`;
    },
    onFileUploaded(responce) {
      this.filename = responce.archive_file.filename;
      this.filename_ext = responce.archive_file.ext;
      this.id = responce.archive_file.id;
      localStorage.setItem('id', this.id);
      this.state = 'UPLOADED';

    },
    runCheckStatus() {
      const timerId = setInterval(async () => {
        const status = await Api.checkStatus(this.id);
        this.state = getState(status.archive_file.state);
        this.percent += .5;
        if (['ERROR', 'READY'].includes(this.state)) {
          clearInterval(timerId)
        }
        if (this.state === 'READY') {
          this.filename_ext = '.zip'
        }
      }, 500);
    }
  },
  created() {
    this.id = localStorage.getItem('token');
  }
}
</script>

<style lang="scss">
.сonverter {
  text-align: center;
  position: relative;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .filename {
    color: #5A9CF8;
    height: 20px;
    margin-bottom: 4px;
  }

  .status {
    margin-bottom: 32px;
  }

  .percent {
    font-weight: bold;
    color: #000;
  }
}

</style>
