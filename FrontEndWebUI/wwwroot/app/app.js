(function() {
    "use strict";
    angular.module("composite.ui.app.controllers", []);
    angular.module("composite.ui.app.services", []);
    var a = angular.module("composite.ui.app", [ "ngRoute", "ngAnimate", "ui.router", "ui.bootstrap", "cgBusy", "radical.itemTemplate", "composite.ui.app.controllers", "composite.ui.app.services", "composite.ui.app.templates" ]);
    a.config([ "$stateProvider", "$locationProvider", "$logProvider", "radicalItemTemplateConfigProvider", function(a, b, c, d) {
        c.debugEnabled(true);
        b.html5Mode(false);
        d.setDefaultSettings({
            templatesFolder: "/app/composition/templates/"
        });
        var e = {
            "": {
                templateUrl: "/app/presentation/dashboardView.html",
                controller: "dashboardController as dashboard"
            }
        };
        a.state("root", {
            url: "",
            views: e
        }).state("dashboard", {
            url: "/",
            views: e
        });
    } ]);
    a.run([ "$log", "$rootScope", "$state", "$stateParams", function(a, b, c, d) {
        b.$state = c;
        b.$log = a;
        b.$stateParams = d;
    } ]);
})();

(function() {
    var a = angular.module("radical.itemTemplate", []);
    a.provider("radicalItemTemplateConfig", function a() {
        var b = {
            templatesFolder: "/radical/itemTemplate/templates/",
            dataTypeProperty: "dataType",
            defaultLoadingTemplate: '<span class="item-template-loading">Loading...</span>',
            defaultLoadingErrorTemplate: "<span>Cannot find any valid template for: {{templateModel}}</span>"
        };
        this.setDefaultSettings = function(a) {
            angular.extend(b, a);
        };
        this.$get = [ "$log", "$http", "$templateCache", function a(c, d, e) {
            return {
                defaultSettings: b,
                defaultTemplatesSelector: function(a, b) {
                    var d = "undefined";
                    if (a) {
                        d = a[b.dataTypeProperty];
                    } else if (b.undefinedTemplateName) {
                        d = b.undefinedTemplateName;
                    }
                    var e = d;
                    c.debug("itemTemplate directive templateSelector dataTypePropertyValue:", d);
                    if (b.templatesMap) {
                        c.debug("itemTemplate directive settings have a templatesMap:", b.templatesMap);
                        if (b.templatesMap[d]) {
                            c.debug("itemTemplate directive templateSelector template found in templatesMap");
                            e = b.templatesMap[d];
                        } else if (b.templatesMap["undefined-template"]) {
                            c.debug("itemTemplate directive settings defines an undefined-template property.");
                            e = b.templatesMap["undefined-template"];
                        }
                    }
                    if (b.templateNamePrefix) {
                        c.debug("itemTemplate directive settings have a templateNamePrefix:", b.templateNamePrefix);
                        e = templateNamePrefix + e;
                    }
                    if (b.templateNameSuffix) {
                        c.debug("itemTemplate directive settings have a templateNameSuffix:", b.templateNameSuffix);
                        e = e + b.templateNameSuffix;
                    }
                    var f = b.templatesFolder + e + ".html";
                    c.debug("itemTemplate directive templateSelector templateUrl:", f);
                    return f;
                },
                defaultTemplatesLoader: function(a) {
                    return d.get(a, {
                        cache: e
                    });
                }
            };
        } ];
    });
    var b = function(a, b, c, d) {
        c.debug("itemTemplate directive injecting function:", d);
        var e = function(b) {
            var e = null;
            if (b.templateSelector) {
                var f = a(b.templateSelector);
                e = f;
                c.debug("itemTemplate directive templateSelector found as attribute: ", b.templateSelector, e);
            } else {
                c.debug("itemTemplate directive templateSelector not found, creating default.");
                e = d.defaultTemplatesSelector;
            }
            return e;
        };
        var f = function(b) {
            var e = null;
            if (b.templatesLoader) {
                var f = a(b.templatesLoader);
                e = f;
                c.debug("itemTemplate directive templatesLoader found as attribute: ", b.templatesLoader, e);
            } else {
                c.debug("itemTemplate directive templatesLoader not found, creating default.");
                e = d.defaultTemplatesLoader;
            }
            return e;
        };
        var g = function(b) {
            var e = null;
            if (b.itemTemplateSettings) {
                var f = a(b.itemTemplateSettings);
                e = f();
                c.debug("itemTemplate directive settings found as attribute: ", b.itemTemplateSettings, e);
                if (!e.templatesFolder) {
                    c.debug("itemTemplate directive settings templatesFolder is missing, setting default.");
                    e.templatesFolder = d.defaultSettings.templatesFolder;
                } else {
                    c.debug("itemTemplate directive settings templatesFolder found:", e.templatesFolder);
                    var g = e.templatesFolder.substring(0, 1);
                    if (g === "^") {
                        c.debug("itemTemplate directive settings templatesFolder starts with the rebasing char ^.");
                        var h = d.defaultSettings.templatesFolder + e.templatesFolder.substring(1);
                        e.templatesFolder = h;
                        c.debug("itemTemplate directive settings rebased templatesFolder:", e.templatesFolder);
                    }
                }
                if (!e.dataTypeProperty) {
                    c.debug("itemTemplate directive settings dataTypeProperty is missing, setting default.");
                    e.dataTypeProperty = d.defaultSettings.dataTypeProperty;
                }
            } else {
                c.debug("itemTemplate directive settings not found, creating defaults.");
                e = angular.copy(d.defaultSettings);
            }
            c.debug("itemTemplate directive settings:", e);
            return e;
        };
        return {
            restrict: "EA",
            transclude: false,
            replace: false,
            scope: {
                templateModel: "=",
                templateContext: "="
            },
            compile: function a(h) {
                var i = {
                    post: function(a, h, i) {
                        c.debug("itemTemplate directive post linker function.");
                        c.debug("[scope, $linkElement, $linkAttributes]", a, h, i);
                        var j = g(i);
                        var k = e(i);
                        var l = f(i);
                        a.$watch("templateModel", function(e) {
                            c.debug("itemTemplate directive templateModel changed [model]:", e);
                            if ((e === null || e === undefined) && !j.handleUndefinedModel) {
                                c.debug("itemTemplate directive templateModel is null, template, if any, will be destroyed.");
                                h.empty();
                            } else {
                                var f = k(e, j);
                                var g = function(c) {
                                    var d = $(c);
                                    h.empty();
                                    if (d.length > 1) {
                                        var e = $("<div></div>");
                                        d.appendTo(e);
                                        e.appendTo(h);
                                    } else {
                                        d.appendTo(h);
                                    }
                                    var f = h.children(0);
                                    var g = b(h.html())(a);
                                    f.replaceWith(g);
                                };
                                g(d.defaultSettings.defaultLoadingTemplate);
                                l(f).success(function(a, b, c, d) {
                                    g(a);
                                }).error(function(a, b, e, f) {
                                    c.error("template loading error: ", a, b, e);
                                    g(d.defaultSettings.defaultLoadingErrorTemplate);
                                });
                            }
                        });
                    }
                };
                return i;
            }
        };
    };
    a.directive("radicalItemTemplate", [ "$parse", "$compile", "$log", "radicalItemTemplateConfig", b ]);
})();

(function() {
    function a(a) {
        var b = a;
        this.dataType = "order";
        var c = {
            0: "Shipped",
            1: "Collecting Items"
        };
        Object.defineProperty(this, "id", {
            get: function() {
                return b.id;
            }
        });
        Object.defineProperty(this, "status", {
            get: function() {
                return c[b.status];
            }
        });
        Object.defineProperty(this, "price", {
            get: function() {
                return b.price;
            }
        });
    }
    angular.module("composite.ui.app.services").config([ "backendCompositionServiceProvider", function(b) {
        var c = "customer-details";
        b.registerQueryHandlerFactory(c, [ "$log", "$http", function(b, d) {
            var e = {
                executeQuery: function(e, f) {
                    b.debug("Ready to handle ", c, " args: ", e);
                    return d.get("http://localhost:53127/api/orders/bycustomer/" + e.id).then(function (d) {
                        var e = [];
                        angular.forEach(d.data, function(b, c) {
                            var d = new a(b);
                            e.push(d);
                        });
                        f.orders = {
                            dataType: "orders",
                            items: e
                        };
                        b.debug("Query ", c, "handled: ", f);
                        return f;
                    });
                }
            };
            return e;
        } ]);
    } ]);
})();

(function() {
    function a(a) {
        var b = a;
        this.dataType = "customer";
        Object.defineProperty(this, "displayName", {
            get: function() {
                return b.displayName;
            }
        });
        Object.defineProperty(this, "id", {
            get: function() {
                return b.id;
            }
        });
    }
    angular.module("composite.ui.app.services").config([ "$stateProvider", "backendCompositionServiceProvider", "navigationServiceProvider", function(b, c, d) {
        b.state("customers", {
            url: "/customers",
            views: {
                "": {
                    templateUrl: "/app/modules/registry/presentation/customersView.html",
                    controller: "customersController",
                    controllerAs: "customers"
                }
            }
        }).state("customerById", {
            url: "/customers/{id}",
            views: {
                "": {
                    templateUrl: "/app/modules/registry/presentation/customerView.html",
                    controller: "customerController",
                    controllerAs: "customer"
                }
            }
        });
        d.registerNavigationItem({
            id: "customers",
            displayName: "Customers",
            url: "/customers"
        });
        var e = "customer-details";
        c.registerQueryHandlerFactory(e, [ "$log", "$http", function(b, c) {
            var d = {
                executeQuery: function(d, f) {
                    b.debug("Ready to handle ", e, " args: ", d);
                    return c.get("http://localhost:53126/api/customers/" + d.id).then(function(c) {
                        var d = new a(c.data);
                        f.customer = d;
                        b.debug("Query ", e, "handled: ", f);
                        return f;
                    });
                }
            };
            return d;
        } ]);
        var f = "customers-list";
        c.registerQueryHandlerFactory(f, [ "$log", "$http", function(b, c) {
            var d = {
                executeQuery: function(d, e) {
                    b.debug("Ready to handle ", f, " args: ", d);
                    var g = "http://localhost:53126/api/customers?p=" + d.pageIndex + "&s=" + d.pageSize;
                    return c.get(g).then(function(c) {
                        b.debug("HTTP response", c.data);
                        var d = [];
                        angular.forEach(c.data, function(b, c) {
                            d.push(new a(b));
                        });
                        e.customers = d;
                        b.debug("Query ", f, "handled: ", e);
                        return e;
                    });
                }
            };
            return d;
        } ]);
    } ]);
})();

(function() {
    angular.module("composite.ui.app.controllers").controller("customerController", [ "$log", "backendCompositionService", "$stateParams", function(a, b, c) {
        var d = this;
        d.isBusy = null;
        d.details = null;
        d.isBusy = b.executeQuery("customer-details", {
            id: c.id
        }).then(function(b) {
            a.debug("customer-details -> composedResult:", b);
            d.details = b;
        });
    } ]);
})();

(function() {
    angular.module("composite.ui.app.controllers").controller("customersController", [ "$log", "backendCompositionService", function(a, b) {
        var c = this;
        c.isBusy = null;
        c.list = null;
        c.isBusy = b.executeQuery("customers-list", {
            pageIndex: 0,
            pageSize: 10
        }).then(function(b) {
            a.debug("customers-list -> composedResult:", b);
            c.list = b.customers;
        });
    } ]);
})();

(function() {
    angular.module("composite.ui.app.controllers").controller("dashboardController", [ "$log", "navigationService", function(a, b) {
        var c = this;
        c.navigationItems = b.navigationItems;
    } ]);
})();

(function() {
    angular.module("composite.ui.app.controllers").controller("navigationController", [ "$log", "navigationService", function(a, b) {
        var c = this;
        c.navigationItems = b.navigationItems;
    } ]);
})();

(function() {
    angular.module("composite.ui.app.services").provider("backendCompositionService", function a() {
        var b = {};
        var c = {};
        this.registerQueryHandlerFactory = function(a, c) {
            if (!b.hasOwnProperty(a)) {
                b[a] = [];
            }
            b[a].push(c);
        };
        this.$get = [ "$log", "$injector", "$q", function a(d, e, f) {
            d.debug("backendCompositionServiceFactory");
            var g = {};
            g.executeQuery = function(a, g) {
                var h = c[a];
                if (!h) {
                    var i = b[a];
                    if (!i) {
                        throw 'Cannot find any valid queryHandler or factory for "' + a + '"';
                    }
                    h = [];
                    angular.forEach(i, function(a, b) {
                        var c = e.invoke(a);
                        h.push(c);
                    });
                    c[a] = h;
                }
                var j = f.defer();
                var k = {
                    dataType: "root"
                };
                var l = [];
                angular.forEach(h, function(a, b) {
                    var c = a.executeQuery(g, k);
                    if (!c) {
                        throw "executeQuery must return a promise.";
                    }
                    l.push(c);
                });
                return f.all(l).then(function(b) {
                    d.debug(a, "-> completed -> ComposedResult: ", k);
                    return k;
                });
            };
            return g;
        } ];
    });
})();

(function() {
    angular.module("composite.ui.app.services").provider("navigationService", function a() {
        var b = {};
        b.navigationItems = [];
        this.registerNavigationItem = function(a) {
            b.navigationItems.push(a);
        };
        this.$get = [ "$log", function a(c) {
            c.debug("navigationServiceFactory");
            return b;
        } ];
    });
})();
//# sourceMappingURL=app.js.map