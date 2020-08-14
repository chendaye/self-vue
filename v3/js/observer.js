function Observer(data) {
    this.data = data;
    this.walk(data);
}

/**
 * todo: 给 Observer 原型链上添加 walk 属性；defineReactive 属性
 */
Observer.prototype = {
     // todo: 遍历 data的所有 key， 添加 getter setter
    walk: function (data) {
        var self = this;
        Object.keys(data).forEach(function (key) {
            self.defineReactive(data, key, data[key]); //todo: (data, key, val) 
        });
    },

    //todo: 给 data 里面的 元素(key) 添加 getter setter
    defineReactive: function (data, key, val) {
        var dep = new Dep();
        var childObj = observe(val);
        //todo: getter 时： 新增 Watcher； setter 时 通知所有 Watcher
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            //todo: 有 对象要获取 key； 返回val；并且 添加 相应 Watcher
            get: function getter() {
                if (Dep.target) {
                    dep.addSub(Dep.target);
                }
                return val;
            },
            //todo: key 有更新；更新，并且通知所有 Watcher
            set: function setter(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                dep.notify();
            }
        });
    }
};

// todo: 创建一个新的 监听器
function observe(value, vm) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
};

//todo: Dep 统一管理 添加订阅(addSub) 和 发布(notify)
function Dep() {
    this.subs = [];
}
Dep.prototype = {
    addSub: function (sub) {
        this.subs.push(sub);
    },
    notify: function () {
        this.subs.forEach(function (sub) {
            sub.update();
        });
    }
};

Dep.target = null;