//重新定义App和Page的生命周期(利用微信提供的App,Page全局)
//重写之后，我就可以在重写的生命周期函数里面做我们需要的统计了
const log = function(e){

    let sengLog = function(){
      //todo 发送数据
    };

    let rewriteAppLifeCycle = {
        onLoad:function(e){
            //重写该方法，并且在触发的时候调用后台接口
            /**
             * 重写的生命周期在resetLifeCycle里面通过call指定了this，所以
             * 当前生命周期的执行环境与原始的生命周期执行环境是一致的，
             * 所以我们可以通过this去访问所有的变量包括路由、options等等参数
             * */

        },
        onShow:function(e){
            //重写该方法，并且在触发的时候调用后台接口
        },
        onHide:function(e){
            //重写该方法，并且在触发的时候调用后台接口
        },
        onError:function(e){
            //重写该方法，并且在触发的时候调用后台接口
        }
    };

    let rewritePageLifeCycle = {
        //这里我们只重写一部分
        onLoad:function(e){},
        onShow: function (e) { },
        onReady: function (e) { },
        onHide: function (e) { },
        onUnload: function (e) { },
    };

    let resetLifeCycle = function(lifeCyleName, oldConfig, newLifeCycle){
        let oldLife = oldConfig[lifeCyleName];
        oldConfig[lifeCyleName] = function(e){//这里重写原来的生命周期函数，有的生命周期函数有参数
            newLifeCycle.call(this, e);
            oldLife && oldLife.call(this, e); //新的生命周期执行后，要执行原有的生命周期，否则自己写的页面的逻辑就不对了
        }
    };

    let rewrite = function(){
        //在这个函数里面重写App和Page
        //改写的时候需要注意一点：我们在改写App和Page生命周期的同时要保证原有生命周期的正常执行
        let oldApp = App;//保存原有App
        App = function(a){ //重写现有的App, a参数是原来的App被调用的时候传入的配置
            //重写App的生命周期函数，
            ["onLoad", "onShow", "onHide", "onError"].forEach((e)=>{
                resetLifeCycle(e, a, rewriteAppLifeCycle[e]);
            });
            oldApp(a);//重写之后要调用原有的方法，否则项目的运行就会出现未知的一些问题了（比如原来写的配置之类的不生效等等）。
        }

        let oldPage = Page;//保存原有的Page
        Page = function(p){ // 重写现有的Page，p参数是原理的Page被调用的时候传入的配置
            ["onLoad", "onShow", "onHide", "onReady"].forEach((e) => {
                resetLifeCycle(e, p, rewritePageLifeCycle[e]);
            });
            oldPage(p);
        }

    }
    rewrite();
}({});
