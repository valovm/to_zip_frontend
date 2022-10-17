<template>
  <div class="сonverter">
    <ProgressBarBg :progress="percent" :variant="progressBarVariant"></ProgressBarBg>
    <div class="сonverter__main" v-if="app_status != 'BAD'">
      <div v-show="state === 'START'">
        <Upload v-show="app_status === 'OK'" :onSuccess="onFileUploaded" :onUploadingStart="onFileUploading"
                :onError="onFileUploadingError" :fileFormats="allowFileFormats" :sizeLimit="sizeLimit"
                :onUploadingProcess="onUploadingProcess"/>
        <div v-if="app_status && app_status != 'OK'">
          <div><b v-html="$t('CONVERTER.APP_STATUSES.' + app_status + '.TITLE')"></b></div>
          <div v-html="$t('CONVERTER.APP_STATUSES.' + app_status + '.BODY')"></div>
        </div>
      </div>
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
      <template v-if="['UPLOADED', 'PENDING','EXTRACTING', 'COMPRESSING'].includes(state)">
        <div class="filename">{{ filename }}<b>{{ filename_ext }}</b></div>
        <div class="status">
          <div class="percent">{{ $t("CONVERTER.STATES." + state) }}</div>
        </div>
      </template>
      <template v-if="state === 'SEEDING'">
        <div class="filename">{{ filename }}<b>{{ filename_ext }}</b></div>
        <div class="status">
          <div class="percent">{{ $t("CONVERTER.STATES." + state) }}</div>
        </div>
        <btn variant="primary" :href="downloadUrl">{{ $t("CONVERTER.DOWNLOAD_BTN") }}</btn>
      </template>
      <template v-if="state === 'COMPLETED'">
        <div class="text-error">{{ $t("CONVERTER.STATES." + state) }}</div>
      </template>
      <div>
        <Btn v-if="['SEEDING', 'COMPLETED', 'ERROR'].includes(state)" :onClick="reset" variant="link_secondary">
          {{ $t('CONVERTER.UPLOAD_AGAIN_BTN') }}
        </Btn>
      </div>
    </div>
    <div class="сonverter__main" v-if="app_status === 'BAD'">
      <div><b v-html="$t('CONVERTER.APP_STATUSES.BAD.TITLE')"></b></div>
      <div v-html="$t('CONVERTER.APP_STATUSES.BAD.BODY')"></div>
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
    'seeding': 'SEEDING',
    'completed': 'COMPLETED',
    'failed': 'FAILED',
  };
  return statuses[status];
}

function getAppStatus(status) {
  const statuses = {
    'ok': 'OK',
    'bad': 'BAD',
    'queue_is_full': 'QUEUE_IS_FULL',
    'seed_is_full': 'SEED_IS_FULL',
  };
  return statuses[status];
}

export default {
  name: "Converter",
  components: {
    Upload, ProgressBarBg
  },
  data: () => ({
    app_status: null,
    state: 'START',
    filename: null,
    filename_ext: null,
    id: null,
    percent: 0,
    progressBarVariant: 'primary',
    allowFileFormats: [],
    sizeLimit: null,
    timerId: null,
    uploadingPercent: 0
  }),
  computed: {
    downloadUrl() {
      return Api.getDownloadLink(this.id);
    },
  },
  watch: {
    id: function (value) {
      if (value) {
        if (this.timerId) {
          clearInterval(this.timerId)
        }
        if (value) {
          this.runCheckStatus();
        }
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
        case 'SEEDING':
          this.percent = 100;
          break;
        case 'COMPLETED':
          this.percent = 100;
          break;
        case 'FAILED':
          this.percent = 100;
          this.progressBarVariant = 'danger';
          break;
      }
    },
  },
  methods: {
    reset() {
      this.stopCheckStatus();
      this.percent = 0;
      this.progressBarVariant = 'primary';
      this.state = 'START';
      localStorage.removeItem('id');
      this.id = null
    },
    onFileUploadingError() {
      this.state = 'START'
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
    onUploadingProcess(progressEvent) {
      this.percent = (progressEvent.loaded / progressEvent.total) * 20
    },
    runCheckStatus() {
      this.timerId = setInterval(async () => {
        const response = await Api.checkStatus(this.id);
        if (response == 'not_found') {
          this.state = 'COMPLETED'
        } else {
          this.state = getState(response.archive_file.state);
          this.filename = response.archive_file.filename;
          this.filename_ext = response.archive_file.ext;

          if (['COMPLETED', 'FAILED'].includes(this.state)) {
            this.stopCheckStatus();
          }
        }
      }, 500);
    },
    stopCheckStatus() {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
    }
  },
  async created() {
    this.id = localStorage.getItem('id');

    // setInterval(async () => {
    const config = await Api.getInitConfig();
    this.app_status = getAppStatus(config.data.state)
    this.allowFileFormats = config.data.extract_extname
    this.sizeLimit = config.data.limit_file_size
    //}, 500);
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
