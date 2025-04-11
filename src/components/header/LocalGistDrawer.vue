<template>
  <el-drawer
    v-model="visible"
    title="本地存储"
    direction="rtl"
    size="30%"
    @open="onDrawerOpen"
    @closed="onDrawerClosed"
  >
    <div class="gistBox">
      <el-table
        :data="gistList"
        style="width: 100%"
        empty-text="还没有保存过代码~"
        v-loading="loading"
        height="100%"
      >
        <el-table-column label="名称" prop="description" />
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
            />
            <el-button
              type="danger"
              :icon="Delete"
              circle
              size="small"
              @click="deleteGist(scope.row.id)"
            />
          </template>
        </el-table-column>
      </el-table>
      
      <div class="paginationBox" v-if="total > 0">
        <el-pagination
          layout="prev, next"
          :current-page="pageNo"
          :page-count="Math.ceil(total / pageSize)"
          prev-text="上一页"
          next-text="下一页"
          @current-change="pageChange"
        />
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElDrawer, ElTable, ElTableColumn, ElButton, ElPagination, ElMessage } from 'element-plus'
import { Delete, Edit } from '@element-plus/icons-vue'
import { localDb } from '@/utils/localDb'
import dayjs from 'dayjs'

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
const loading = ref(false)
const pageNo = ref(1)
const pageSize = ref(20)
const total = ref(0)

const onDrawerOpen = async () => {
  try {
    loading.value = true
    // 获取总数
    const allGists = await localDb.getAllGists()
    total.value = allGists.length
    
    // 获取分页数据
    const data = await localDb.getGists(pageNo.value, pageSize.value)
    gistList.value = data
    loading.value = false
  } catch (e) {
    console.error(e)
    loading.value = false
    ElMessage.error('获取失败')
  }
}

const pageChange = (page) => {
  pageNo.value = page
  onDrawerOpen()
}

const onDrawerClosed = () => {
  gistList.value = []
  pageNo.value = 1
  total.value = 0
}

const deleteGist = async (id) => {
  try {
    loading.value = true
    await localDb.deleteGist(id)
    loading.value = false
    ElMessage.success('删除成功')
    onDrawerOpen()
  } catch (error) {
    console.log(error)
    loading.value = false
    ElMessage.error('删除失败')
  }
}

const updateGist = async (id) => {
  try {
    // 先获取本地数据
    const localData = await localDb.getGist(id)
    if (!localData) {
      ElMessage.error('数据不存在')
      return
    }
    
    // 确保数据加载完成后再关闭抽屉并跳转
    visible.value = false
    
    // 使用 push 而不是 replace 来避免重定向问题
    router.push({
      name: 'LocalEdit',
      params: {
        id: String(id)
      }
    })
  } catch (error) {
    console.error(error)
    ElMessage.error('加载数据失败')
  }
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
