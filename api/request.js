import axios from 'axios'
import store from '../store/index.js'
import urlConfig from './config.js'

const request={}

/**

* 如果是访问外部链接，可以直接写入url，就不会带入原有的服务器访问地址

*/

const getUrl = (url) => {

	if (url.indexOf('://') == -1) {

		url = urlConfig + url;//地址拼接

	}

	return url

}

request.globalRequest = (url, method, data) => {

//有需要可以设置头部信息
	 let headers = {};
	 if (store.state.userInfo && store.state.userInfo.session_id) {

	 	var sessionId = store.state.userInfo.session_id;

	 	headers['session-id'] = sessionId

	 }



	 headers['Authorization'] = 'Authorization xxxxxxx'

	 uni.showLoading({

		title: '加载中...'

	 });

	//store.commit("setLoading", true)



	return new Promise((resolve, reject) => {

		uni.request({

			url: getUrl(url),

			method,

			data: data,

			dataType: 'json',

			header: headers,

			success: res => {

				// uni.hideLoading();

				console.log(res)

				setTimeout(() => {

					// 服务端响应的 message 提示

					uni.showToast({

					 title: "获取成功",

					 icon: "none",

					 position: 'bottom'

					 })

					//延时关闭 加载中的 loading框

					uni.hideToast()

					store.commit("setLoading", false)

				}, 300)

				console.log(url + '接口返回数据如下');

				console.log(res)

				if (res.statusCode == 403) {

					uni.showToast({

						title: '拒绝访问',

						icon: 'none'

					});

					return reject()

				}

//...其他错误提醒一样处理

				//成功的处理函数 这边的code表示请求结果

				switch (res.data.code) {

					case 1:

						//成功

						if (res.data.message) {



							uni.showToast({

								title: res.data.message,

								icon: 'success'

							})

						}

						uni.hideLoading()



						return resolve(res.data.data)

						break

					case 0:

						// 失败

						uni.showToast({

							title: res.data.message,

							icon: 'none'

						})

						uni.hideLoading()

						return reject()

						break

					case 401:

						// 未授权或者过期 跳转到提醒页面

						uni.navigateTo({

							url: '/pages/index/index',

						})

						uni.hideLoading()

						return reject()

						break

						// 其他的code

					default:

						uni.showToast({

							title: res.data.message,

							icon: 'none'

						})

						uni.hideLoading()

						return reject()

						break

				}

			},

			fail: parmas => {

				console.log(parmas)

				uni.hideLoading()

				switch (parmas.code) {

					case 401:

						uni.clearStorageSync()

						break

					default:

						uni.showToast({

							title: '网络不给力~',

							icon: 'none'

						})

						return reject(parmas)

						break

				}

			}

		})

	})

}

export default request