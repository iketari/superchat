# Учебный проект. Чат #

[![Build Status](https://travis-ci.org/iketari/superchat.svg?branch=master)](https://travis-ci.org/iketari/superchat) [![devDependencies Status](https://david-dm.org/iketari/superchat/dev-status.svg)](https://david-dm.org/iketari/superchat?type=dev) [![dependencies Status](https://david-dm.org/iketari/superchat/status.svg)](https://david-dm.org/iketari/superchat)

## Production ##

https://superchat-production.firebaseapp.com/

## Stage ##

https://components-e2e6e.firebaseapp.com/

## Разработка ##

- `npm i`
- `npm start`

## Modules

<dl>
<dt><a href="#module_Router">Router</a> : <code>Router</code></dt>
<dd><p>Simple router based on HTML5 History API</p>
</dd>
<dt><a href="#module_utils">utils</a></dt>
<dd></dd>
<dt><a href="#module_AvatarService">AvatarService</a></dt>
<dd><p>Service for getting users avatars in chat</p>
</dd>
<dt><a href="#module_ChatService">ChatService</a></dt>
<dd><p>Service of chat functionality. Provide sending and polling of messages.</p>
</dd>
<dt><a href="#module_HttpService">HttpService</a></dt>
<dd><p>Service for making of http requests</p>
</dd>
</dl>

## Mixins

<dl>
<dt><a href="#Emitter">Emitter</a> : <code><a href="#Emitter">Emitter</a></code></dt>
<dd><p>This provides methods used for event handling. It&#39;s not meant to
be used directly.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ChatData">ChatData</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ChatMessage">ChatMessage</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="module_Router"></a>

## Router : <code>Router</code>
Simple router based on HTML5 History API


* [Router](#module_Router) : <code>Router</code>
    * [~{Router}](#module_Router..{Router})
    * [~node](#module_Router..node) : <code>HTMLElement</code>
    * [~history](#module_Router..history) : <code>History</code>
    * [~routes](#module_Router..routes) : <code>Object</code>
    * [~route(path, view)](#module_Router..route)
    * [~start()](#module_Router..start)
    * [~go(path)](#module_Router..go) ⇒ <code>boolean</code>

<a name="module_Router..{Router}"></a>

### Router~{Router}
**Kind**: inner class of [<code>Router</code>](#module_Router)  
<a name="module_Router..node"></a>

### Router~node : <code>HTMLElement</code>
**Kind**: inner property of [<code>Router</code>](#module_Router)  
<a name="module_Router..history"></a>

### Router~history : <code>History</code>
**Kind**: inner property of [<code>Router</code>](#module_Router)  
<a name="module_Router..routes"></a>

### Router~routes : <code>Object</code>
**Kind**: inner property of [<code>Router</code>](#module_Router)  
<a name="module_Router..route"></a>

### Router~route(path, view)
Register the view for the path

**Kind**: inner method of [<code>Router</code>](#module_Router)  
**Access**: public  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| view | <code>BaseView</code> | 

<a name="module_Router..start"></a>

### Router~start()
Start listening popstate event and clicks on links into the node

**Kind**: inner method of [<code>Router</code>](#module_Router)  
**Access**: public  
<a name="module_Router..go"></a>

### Router~go(path) ⇒ <code>boolean</code>
Switch route to the path

**Kind**: inner method of [<code>Router</code>](#module_Router)  
**Returns**: <code>boolean</code> - - is route exists  
**Access**: public  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 

<a name="module_utils"></a>

## utils

* [utils](#module_utils)
    * [~deepEqual(src, dest)](#module_utils..deepEqual) ⇒ <code>boolean</code>
    * [~capitalize(str)](#module_utils..capitalize) ⇒ <code>string</code>

<a name="module_utils..deepEqual"></a>

### utils~deepEqual(src, dest) ⇒ <code>boolean</code>
Сравнивает объекты по значниию

**Kind**: inner method of [<code>utils</code>](#module_utils)  

| Param | Type |
| --- | --- |
| src | <code>Object</code> | 
| dest | <code>Object</code> | 

<a name="module_utils..capitalize"></a>

### utils~capitalize(str) ⇒ <code>string</code>
Поднимает первую букву строки в верхний регистр

**Kind**: inner method of [<code>utils</code>](#module_utils)  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

<a name="module_AvatarService"></a>

## AvatarService
Service for getting users avatars in chat

<a name="module_ChatService"></a>

## ChatService
Service of chat functionality. Provide sending and polling of messages.


* [ChatService](#module_ChatService)
    * [exports.ChatService](#exp_module_ChatService--exports.ChatService) ⏏
        * _instance_
            * [.symbol](#module_ChatService--exports.ChatService+symbol)
            * [.apply(recipient)](#module_ChatService--exports.ChatService+apply)
        * _inner_
            * [~setUserName(name)](#module_ChatService--exports.ChatService..setUserName)

<a name="exp_module_ChatService--exports.ChatService"></a>

### exports.ChatService ⏏
**Kind**: Exported class  
**Mixes**: [<code>Emitter</code>](#Emitter)  
<a name="module_ChatService--exports.ChatService+symbol"></a>

#### exports.ChatService.symbol
Link for symbol for storign callbacks

**Kind**: instance property of [<code>exports.ChatService</code>](#exp_module_ChatService--exports.ChatService)  
**Mixes**: [<code>symbol</code>](#Emitter.symbol)  
<a name="module_ChatService--exports.ChatService+apply"></a>

#### exports.ChatService.apply(recipient)
Method for apply mixin to the recipient

**Kind**: instance method of [<code>exports.ChatService</code>](#exp_module_ChatService--exports.ChatService)  
**Mixes**: [<code>apply</code>](#Emitter.apply)  

| Param | Type | Description |
| --- | --- | --- |
| recipient | <code>\*</code> | object to install functionality |

<a name="module_ChatService--exports.ChatService..setUserName"></a>

#### exports.ChatService~setUserName(name)
**Kind**: inner method of [<code>exports.ChatService</code>](#exp_module_ChatService--exports.ChatService)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | set username field |

<a name="module_HttpService"></a>

## HttpService
Service for making of http requests

<a name="Emitter"></a>

## Emitter : [<code>Emitter</code>](#Emitter)
This provides methods used for event handling. It's not meant to
be used directly.

**Kind**: global mixin  

* [Emitter](#Emitter) : [<code>Emitter</code>](#Emitter)
    * [.symbol](#Emitter.symbol)
    * [.apply(recipient)](#Emitter.apply)

<a name="Emitter.symbol"></a>

### Emitter.symbol
Link for symbol for storign callbacks

**Kind**: static property of [<code>Emitter</code>](#Emitter)  
<a name="Emitter.apply"></a>

### Emitter.apply(recipient)
Method for apply mixin to the recipient

**Kind**: static method of [<code>Emitter</code>](#Emitter)  

| Param | Type | Description |
| --- | --- | --- |
| recipient | <code>\*</code> | object to install functionality |

<a name="ChatData"></a>

## ChatData : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| user | <code>string</code> | имя текущего пользователя |
| messages | [<code>Array.&lt;ChatMessage&gt;</code>](#ChatMessage) | масси сообщений в чате |

<a name="ChatMessage"></a>

## ChatMessage : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | Текст сообщения |
| name | <code>string</code> | имя отправителя сообщения |

