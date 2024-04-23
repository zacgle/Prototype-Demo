import request from '@/utils/request-prototype'

export function getTopology() {
  return request({
    url: '/topo/',
    method: 'get'
  })
}
export function startNet() {
  return request({
    url: '/net/',
    method: 'get'
  })
}
export function endNet() {
  return request({
    url: '/end/',
    method: 'get'
  })
}
export function sendPkg() {
  return request({
    url: '/newsend/',
    method: 'get'
  })
}
export function getDrlPath() {
  return request({
    url: '/path/',
    method: 'get'
  })
}
export function netOnOff() {
  return request({
    url: '/netstatus/',
    method: 'get'
  })
}
export function getGlobalDelay() {
  return request({
    url: '/delay/',
    method: 'get'
  })
}
export function fault(params) {
  return request({
    url: '/fault/',
    method: 'get',
    params
  })
}
export function deleteItem(params) {
  return request({
    url: '/test/',
    method: 'get',
    params
  })
}
export function addItem(params) {
  return request({
    url: '/test/',
    method: 'get',
    params
  })
}
export function delayChart(params) {
  return request({
    url: '/time/',
    method: 'get',
    params
  })
}
export function bandChart(params) {
  return request({
    url: '/band/',
    method: 'get',
    params
  })
}
export function verify(params) {
  return request({
    url: '/verify/',
    method: 'get',
    params
  })
}
export function getPolicyFG() {
  return request({
    url: '/verifyProcess/',
    method: 'get'
  })
}
export function kgSearch(params) {
  // 知识图谱搜索
  return request({
    url: '/kgSearch/',
    method: 'get',
    params
  })
}
export function kgDetail() {
  // 知识图谱详情
  return request({
    url: '/kgDetail/',
    method: 'get'
  })
}
export function kgAdd(params) {
  return request({
    url: '/kgAdd/',
    method: 'get',
    params
  })
}
export function kgDelete(params) {
  return request({
    url: '/kgDelete/',
    method: 'get',
    params
  })
}
export function history(params) {
  return request({
    url: '/history/',
    method: 'get',
    params
  })
}
export function intend(params) {
  return request({
    url: '/intend/',
    method: 'get',
    params
  })
}
export function advice(params) {
  return request({
    url: '/advice/',
    method: 'get',
    params
  })
}
export function retrans(params) {
  return request({
    url: '/trans/',
    method: 'get',
    params
  })
}
export function lumi(params) {
  return request({
    url: '/lumi/',
    method: 'get',
    params
  })
}
export function flumi(params) {
  return request({
    url: '/flumi/',
    method: 'get',
    params
  })
}
export function getDetail(params) {
  return request({
    url: '/lumishow/',
    method: 'get',
    params
  })
}
export function chat(params) {
  return request({
    url: '/chat/',
    method: 'get',
    params
  })
}
export function getIntentDetail() {
  return request({
    url: '/intentDetail/',
    method: 'get'
  })
}
export function slicing(params) {
  return request({
    url: '/slicing/',
    method: 'get',
    params
  })
}
// slinfo/
export function slinfo() {
  return request({
    url: '/slinfo/',
    method: 'get'
  })
}
export function slnet() {
  return request({
    url: '/slnet/',
    method: 'get'
  })
}
export function slink(params) {
  return request({
    url: '/slink/',
    method: 'get',
    params
  })
}
export function getSliceCard() {
  return request({
    url: '/slgraph/',
    method: 'get'
  })
}
export function multipath() {
  return request({
    url: '/multipath/',
    method: 'get'
  })
}
export function getKnowledgeStatic() {
  return request({
    url: '/kgConc/',
    method: 'get'
  })
}
export function get_node_info_table(params) {
  return request({
    url: '/nodecounts/',
    method: 'get',
    params
  })
}
export function get_node_info_search(params) {
  return request({
    url: '/nodesearch/',
    method: 'get',
    params
  })
}
