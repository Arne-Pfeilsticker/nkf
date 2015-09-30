(function () {
    'use strict';

    angular.module('nkfApp').controller('BudgetController', BudgetController);

    BudgetController.$inject = ['$scope', 'nkfApi', 'productTypes', 'personsBooked', 'framework', 'frameworkShortcuts'];

    function BudgetController($scope, nkfApi, productTypes, personsBooked, framework, frameworkShortcuts) {
        /* jshint validthis: true */
        var vm = this;

        vm.personsBooked = personsBooked;
        vm.personId = '';

        //vm.yearDimensionData = {};

        //todo: implement locals
        vm.deDE = {
            decimal: ",",
            thousands: ".",
            grouping: [3],
            currency: ["", "\xa0€"]
        };

        vm.numberFormat = d3.format('04d');
        vm.currenFormat = d3.format(',.0f');
        vm.formatNumber = d3.format(".1f");

        vm.rowChartOptions = {
            width: 300,
            height: 200,
            gap: 2,
            cap: 7,
            othersLabel: 'Sonstige',
            elasticX: true,
            elasticY: true,
            //sortBy: function (d) {return d.amount;}, // Does not work in Crom
            x: d3.scale.linear()
        };

        vm.rowChartPostSetup = function (c) {
            c.label(function (d) {
                return d.key + ' ' + (vm.productTypes[d.key] ? vm.productTypes[d.key] : '');
            })
                .title(function (d) {
                    return d.key + ': ' + vm.currenFormat(d.value / 1000) + ' Mio.€';
                })
                //.xAxis().tickFormat(formatCurrency)
                .xAxis().tickFormat(function (v) {
                    return v / 1000;
                })
            ;
            c.xAxis().ticks(5);
        };

        function formatCurrency(d) {
            var s = vm.formatNumber(d / 1000);
            //var t = $scope.d3.scale.linear().domain();
            //var t = vm.rowChartOptions.x.domain();
            //var u = d === t[1] ? s + " Mio.€" : s;
            return s;
            //return d === $scope.x.domain()[1] ? s + " Mio.€" : s;
        }

        vm.productTypes = {};
        vm.productTypeParent = {};
        var i, len;

        for (i = 0, len = productTypes.length; i < len; i++) {

            vm.productTypes[productTypes[i].id] = productTypes[i].label;
            /* jshint validthis: true */
            vm.productTypeParent[productTypes[i].id] = productTypes[i].parent_id; // jshint ignore:line
        }

        vm.frameworkShortcuts = {};

        for (i = 0, len = frameworkShortcuts.length; i < len; i++) {

            vm.frameworkShortcuts[frameworkShortcuts[i].id] = frameworkShortcuts[i].shortcut;
        }

        vm.framework = {};
        vm.frameworkLevelMax = 0;
        vm.frameworkRid = '';
        vm.frameworkId = '';

        for (i = 0, len = framework.length; i < len; i++) {

            vm.frameworkRid = framework[i].rid;
            vm.frameworkId = framework[i].id;

            framework[i].$path =  framework[i].$path.match(/(#\d+:\d+)/g) ;

            vm.framework[vm.frameworkRid] = framework[i];
            vm.framework[vm.frameworkId] = vm.frameworkRid;

            if (vm.frameworkLevelMax < framework[i].treeLevel) {
                vm.frameworkLevelMax = framework[i].treeLevel;
            }
        }


        //console.log(vm.framework);

        // ui-grid
        //vm.gridOptions = {
        //    data: 'vm.yearDimensionData',
        //    enableFiltering: true,
        //    enableSorting: true,
        //    enableGridMenu: true,
        //    columnDefs: [
        //        {field: 'bookingYear', displayName: 'Jahr',  width: '*'},
        //        {field: 'productId', displayName: 'Produkt', type: 'string', width: '*'},
        //        {field: 'account', displayName: 'Konto', type: 'string', width: '*'},
        //        {field: 'amount', displayName: 'Betrag', cellTemplate: '<div class=\'ui-grid-cell-contents\' style=\'text-align: right\'>{{COL_FIELD  | currency:\'€\':0}}</div>' }
        //    ],
        //    importerDataAddCallback: function (grid, newObjects) {
        //        vm.yearDimensionData = vm.yearDimensionData.concat(newObjects);
        //    },
        //    onRegisterApi: function (gridApi) {
        //        vm.gridApi = gridApi;
        //    }
        //
        //};

        var dstr;

        vm.ndx = crossfilter();
        //console.log(vm.ndx);

        vm.yearDimension = vm.ndx.dimension(function (d) {
            return d.bookingYear;
        });

        vm.paymentsSumGroup = vm.yearDimension.group().reduceSum(function (d) {
            return Math.round(d.amount / 1000000);
        });

        vm.paymentsInSumGroup = vm.yearDimension.group().reduceSum(function (d) {
            return Math.round(d.paymentsIn / 1000000);
        });

        vm.paymentsOutSumGroup = vm.yearDimension.group().reduceSum(function (d) {
            return Math.round(d.paymentsOut / 1000000);
        });

        //console.log(vm.paymentsSumGroup.top(3));
        //console.log(vm.paymentsOutSumGroup.top(2));

        vm.prod1Dimension = vm.ndx.dimension(function (d) {
            dstr = d.productId.substring(0, 1);
            return typeof dstr === 'string' ? dstr : 'prod1Dimension';
            //return d.productId.substring(0, 1);
        });

        vm.prodIn1SumGroup = vm.prod1Dimension.group().reduceSum(function (d) {
            return Math.round(d.paymentsIn / 1000);
        });

        vm.prodOut1SumGroup = vm.prod1Dimension.group().reduceSum(function (d) {
            return Math.round(d.paymentsOut / 1000);
        });

        vm.prod2Dimension = vm.ndx.dimension(function (d) {
            dstr = vm.productTypeParent[d.productId];
            return typeof dstr === 'string' ? dstr : 'prod2Dimension';
            //return vm.productTypeParent[d.productId];
        });

        vm.prodIn2SumGroup = vm.prod2Dimension.group().reduceSum(function (d) {
            return Math.round(d.paymentsIn / 1000);
        });

        vm.prodOut2SumGroup = vm.prod2Dimension.group().reduceSum(function (d) {
            return Math.round(d.paymentsOut / 1000);
        });

        vm.prod3Dimension = vm.ndx.dimension(function (d) {
            dstr = d.productId;
            return typeof dstr === 'string' ? dstr : 'prod3Dimension';
            //return d.productId;
        });

        vm.prodIn3SumGroup = vm.prod3Dimension.group().reduceSum(function (d) {
            return Math.round(d.paymentsIn / 1000);
        });

        vm.prodOut3SumGroup = vm.prod3Dimension.group().reduceSum(function (d) {
            return Math.round(d.paymentsOut / 1000);
        });

        // Account dimensions and groups

        //vm.account1Dimension = vm.ndx.dimension(function (d) {
        //    vm.frameworkIdObject = vm.framework[vm.framework[d.account]];
        //    vm.frameworkId = vm.frameworkIdObject.$path[3];
        //
        //    if (vm.frameworkIdObject.TreeLevel > 2) {
        //        if (typeof vm.frameworkId === 'string') {
        //            return vm.frameworkId;
        //        } else {
        //            console.log('Fehler value account1Dimension: ' + d.account);
        //            return '_unknownAccount';
        //        }
        //    }
        //    //return vm.framework[vm.framework[d.account]].treeLevel > 2 ? vm.framework[vm.framework[d.account]].$path[3] : "";
        //});
        //
        //vm.accountIn1SumGroup = vm.account1Dimension.group().reduceSum(function (d) {
        //    return Math.round(d.paymentsIn / 1000);
        //});
        //
        //vm.accountOut1SumGroup = vm.account1Dimension.group().reduceSum(function (d) {
        //    return Math.round(d.paymentsOut / 1000);
        //});

        //Payment group dimension
        vm.paymentDimension = vm.ndx.dimension(function (d) {
            return Math.round(d.amount / 1000);
        });
        vm.paymentMax = 2000000;

        //console.log(vm.paymentDimension);
        //vm.paymentGroup = vm.paymentDimension.group(function (d) {
        //    return d.aumount;
        //});
        vm.paymentGroup = vm.paymentDimension.group().reduceSum(function (d) {
            return Math.round(d.amount / 1000);
        });
        //console.log(vm.paymentGroup);

        vm.paymentRangeChartOptions = {
            // title can be called by any stack layer.
            title: function (d) {
                return d.value;
            }
        };
        // Workaround: https://github.com/TomNeyland/angular-dc/issues/15
        // paymentRageSelectChart has to be defined separately due to an error in angular-dc
        // The attribute rangeChart can't be set directly in the range chart.
        vm.paymentRangeSelectChart = dc.barChart("#paymentRangeSelectChart", "1");
        vm.paymentRangeSelectChart.alwaysUseRounding(true)
            .width(1100)
            .height(85)
            .margins({top: 0, right: 25, bottom: 40, left: 60})
            .brushOn(true)
            .elasticX(true) // First get the right size, then it has to be set to false in order to work.
            .elasticY(true)
            .centerBar(true)
            .gap(0)
            .dimension(vm.paymentDimension)
            .group(vm.paymentGroup)
            .outerPadding(0.05)
            //.renderHorizontalGridLines(true)
            .xAxisLabel('Zahlungen gruppiert nach Jahr, Produkt, Konto und Betrag in T€')
            .yAxisLabel(' ')
            .x(d3.scale.linear().domain([0, vm.paymentMax]))
            //.y(d3.scale.linear().domain([0, vm.paymentMax]))
            .y(d3.scale.log().domain([1, vm.paymentMax]))
            .yAxis().ticks(0)
        ;

        vm.setupRangeChart = function (myRangeChart) {
            myRangeChart.rangeChart(vm.paymentRangeSelectChart);
            vm.paymentRangeSelectChart.render();
        };

        //vm.rowChartProductField = dc.rowChart("#rowChartProductField");
        //vm.rowChartProductField
        //    .dimension(vm.prod1Dimension)
        //    .group(vm.prod1SumGroup)
        //    .chartGroup("1")
        //    .width(300)
        //    .height(200)
        //    .gap(2)
        //    .cap(7)
        //    .othersLabel('Sonstige')
        //    .elasticX(true)
        //    .elasticY(true)
        //    .sortBy(function (d) {return d.amount;})
        //    .x(d3.scale.linear().domain([0, 2000000]))
        //;
        //
        //vm.rowChartProductField.render();

        // data table does not use crossfilter group but rather a closure
        // as a grouping function
        vm.tableGroup = function (d) {

            return d.bookingYear;
        };

        vm.piePostSetupChart = function (c) {
            c.label(function (d) {
                return d.key + ' ' + vm.productTypes[d.key];
                //return d.key;
            });
        };

        vm.tablePostSetupChart = function (c) {
            // dynamic columns creation using an array of closures
            c.columns([
                function (d) {
                    return d.bookingYear;
                },
                function (d) {
                    return d.productId + ' ' + (vm.productTypes[d.productId] ? vm.productTypes[d.productId] : '');
                },
                function (d) {
                    return d.account + ' ' + (vm.frameworkShortcuts[d.account] ? vm.frameworkShortcuts[d.account] : '');
                },
                function (d) {
                    return '<span style="float:right; padding-right:5px">' + vm.currenFormat(d.amount) + '</span>';
                }
            ])
                // (optional) sort using the given field, :default = function(d){return d;}
                .sortBy(function (d) {
                    return d.amount;
                })
                // (optional) sort order, :default ascending
                .order(d3.descending)
                // (optional) custom renderlet to post-process chart using D3
                .on('renderlet', function (table) {
                    table.selectAll(".dc-table-group").classed("info", true);
                });

            //vm.yearDimensionData = vm.yearDimension.top(Infinity);
        };

        vm.resetAll = function () {
            dc.filterAll("1");
            dc.redrawAll("1");
        };

        vm.bookingsData = function (values) {
            vm.loading = true;
            //var DE = d3.locale(vm.deDE);

            //console.log(vm.bookingsData[0].personId);
            nkfApi.getBookingsByPid(values)
                .then(function (results) {

                    results.forEach(function (d) {
                        //d.bookingYear = vm.numberFormat(d.bookingYear);
                        if (d.account.substring(0, 7) === 'NKF05F1') {
                            d.paymentsIn = d.amount;
                            d.paymentsOut = 0;
                        } else {
                            d.paymentsIn = 0;
                            d.paymentsOut = d.amount;
                        }
                    });
                    //console.log('Imported bookings data', results);

                    vm.ndx.add(results);
                    //console.log(vm.ndx);
                    vm.paymentMax = Math.round(vm.paymentDimension.top(1)[0].amount / 1000);
                    vm.resetAll();
                    // Reset elasticX to false, otherwise rage chart won't work.
                    $scope.paymentRangeChart.elasticX(false);
                })
                .catch(function (err) {
                    console.log('Error Imported bookings data', err);
                })
                .finally(function () {
                    vm.loading = false;
                });
        };
    }
})();