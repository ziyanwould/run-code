<template>
  <el-drawer
    v-model="visible"
    title="我的gists"
    direction="rtl"
    :size="isMobile ? '90%' : '30%'"
    @open="onDrawerOpen"
    @closed="onDrawerClosed"
  >
    <div class="gistBox">
      <el-table
        :data="gistList"
        style="width: 100%"
        empty-text="好像没有更多了~"
        v-loading="gistloading"
        height="100%"
      >
        <el-table-column label="名称" prop="description" />
        <el-table-column label="是否公开" prop="public" width="80" align="center">
          <template #default="scope">
            {{ scope.row.public ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at" width="110" align="center">
          <template #default="scope">
            {{ dayjs(scope.row.created_at).format('YYYY/MM/DD') }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updated_at" width="150" align="center">
          <template #default="scope">
            {{ dayjs(scope.row.updated_at).format('YYYY/MM/DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              :icon="Edit"
              circle
              size="small"
              @click="updateGist(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              :icon="Delete"
              circle
              size="small"
              @click="deleteGist(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationBox">
        <el-pagination
          layout="prev, next"
          :current-page="gistPageNo"
          :page-count="gistPageCount"
          prev-text="上一页"
          next-text="下一页"
          @current-change="gistCurrentChange"
        ></el-pagination>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElDrawer, ElTable, ElTableColumn, ElButton, ElPagination, ElMessage } from 'element-plus'
import { Delete, Edit } from '@element-plus/icons-vue'
import { request } from '@/utils/octokit'
import { isMobileDevice } from '@/utils'
import dayjs from 'dayjs'

const isMobile = isMobileDevice()

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const router = useRouter()
const route = useRoute()
const gistList = ref([])
const gistloading = ref(false)
const gistPageNo = ref(1)
const gistPageCount = ref(1)

const onDrawerOpen = async () => {
  try {
    gistloading.value = true
    let { data } = await request('GET /gists', {
      page: gistPageNo.value,
      per_page: 20
    })
    if (data.length > 0) {
      gistPageCount.value = gistPageNo.value + 1
    }

    console.log('[gistList]', JSON.parse(JSON.stringify(data)))

    gistList.value = data
    gistloading.value = false
  } catch (e) {
    gistloading.value = false
    ElMessage.error('获取失败')
  }
}

const gistCurrentChange = pageNo => {
  gistPageNo.value = pageNo
  onDrawerOpen()
}

const onDrawerClosed = () => {
  gistList.value = []
  gistPageNo.value = 1
}

const deleteGist = async id => {
  try {
    gistloading.value = true
    await request(`DELETE /gists/${id}`, {
      gist_id: id
    })
    gistloading.value = false
    ElMessage.success(
      '删除成功，请注意：删除不是一个同步的过程，五分钟内请不要重复删除！'
    )
    if (id === route.params.id) {
      router.replace({
        name: 'Editor'
      })
    }
  } catch (error) {
    console.log(error)
    gistloading.value = false
    ElMessage.error('删除失败')
  }
}

const updateGist = id => {
  visible.value = false
  router.replace({
    name: 'Edit',
    params: {
      id
    }
  })
}
</script>

<style scoped lang="less">
:deep(.el-drawer__body) {
  overflow: hidden;

  .gistBox {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .paginationBox {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
