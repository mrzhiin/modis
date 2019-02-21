# 后端

## leancloud

1. 注册 [Leancloud](http://leancloud.cn)，创建应用，获取应用的 `appId` 和 `appKey`

1. 创建名为 `Page` 和 `Comment` 的 Class ，ACL 选择 `限制写入`

1. 在 Class `Page` 中添加列 `pathname` ，并为其添加 `唯一索引`

1. 在 Class `Comment` 中添加列 `email` ，并将其设为 `客户端不可见`（可选）

## valine

1. 注册 [Leancloud](http://leancloud.cn)，创建应用，获取应用的 `appId` 和 `appKey`

1. 创建名为 `Comment` 的 Class ，ACL 选择 `限制写入`
