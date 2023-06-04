# admin-be

后台管理系统后端

## 文件介绍

### interceptor

transform.interceptor.ts 拦截器转换输出给客户端的数据以固定格式({data, code, message})返回

### filters

all.exception.filter.ts 处理非http异常如代码错误、语法错误等
http.exception.filter.ts 处理http异常如接口400 500等

### exceptions

bussiness.exception.ts 自定义业务异常接收一个errorCode返回异常信息，该类继承HttpException，抛出异常会走到http.exception.filter.ts逻辑

### dto

全局dto统一response和paginateResponse

### constsants

errorCode.ts 业务错误码集合，所有的业务错误都需要在这里定义错误码，以便查询与维护

### enum

枚举，主要定义一些字典枚举如性别等

### shared

utils.service.ts 全局通用工具服务，注册为全局module

### modules

核心业务逻辑，所有业务逻辑按照nest规范创建module
