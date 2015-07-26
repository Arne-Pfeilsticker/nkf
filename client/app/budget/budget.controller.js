(function () {
    'use strict';

    angular.module('nkfApp').controller('BudgetController', BudgetController);

    BudgetController.$inject = ['$scope', '$state', '$http', 'nkfApi'];

    function BudgetController($scope, $state, $http, nkfApi) {
        /* jshint validthis: true */
        var vm = this;

        vm.personId = 'de.05124000';

        //vm.yearDimension = {};
        //vm.prod1Dimension = {};
        //vm.prod2Dimension = {};
        //vm.prod3Dimension = {};
        //vm.prod1SumGroup = {};
        //vm.prod2SumGroup = {};
        //vm.prod3SumGroup = {};
        //vm.paymentDimension = {};
        //vm.paymentGroup = {};
        //vm.paymentRangeChartOptions = {};
        //vm.paymentsOutSumGroup = {};
        //vm.paymentsSumGroup = {};
        //vm.setupRangeChart = {};


        vm.getProductTypes = function () {
            nkfApi.getProductTypes()
                .then(function (result) {
                    var pid, plabel, productTypes;

                    for (var i = 0, len = result.length; i < len; i++) {
                        pid = result['id'];
                        plabel = result['label'];
                        productTypes[pid] = plabel;
                    }
                    vm.loadingProductTypes = true;
                    console.log(productTypes);

                    return productTypes;
                })
                .catch(function (err) {
                    console.log('Error Imported product type data', err);
                })
                .finally(function () {
                    vm.loadingProductTypes = false;
                });
        };
        vm.productTypes = vm.getProductTypes();
        console.log(vm.productTypes);

        vm.bookingsData = function (values) {
            vm.loading = true;
            var numberFormat = d3.format('04d');
            var currenFormat = d3.format('.2f');

            //console.log(vm.bookingsData[0].personId);
            nkfApi.getBookingsByPid(values)
                .then(function (results) {

                    results.forEach(function (d) {
                        //d.bookingYear = numberFormat(d.bookingYear);
                        if (d.account.substring(0, 7) === 'NKF05F1') {
                            d.paymentsIn = d.amount;
                            d.paymentsOut = 0;
                        } else {
                            d.paymentsIn = 0;
                            d.paymentsOut = d.amount;
                        }
                    });
                    //console.log('Imported bookings data', results);

                    vm.ndx = crossfilter(results);
                    //console.log(vm.ndx);
                    vm.yearDimension = vm.ndx.dimension(function (d) {
                        return d.bookingYear;
                    });
                    //console.log(vm.yearDimension);
                    vm.paymentsSumGroup = vm.yearDimension.group().reduceSum(function (d) {
                        return +d.paymentsIn / 1000000;
                    });

                    vm.paymentsOutSumGroup = vm.yearDimension.group().reduceSum(function (d) {
                        return +d.paymentsOut / 1000000;
                    });

                    //console.log(vm.paymentsSumGroup);
                    //console.log(vm.paymentsOutSumGroup);

                    vm.prod1Dimension = vm.ndx.dimension(function (d) {
                        return d.productId.substring(0, 1);
                    });

                    vm.prod1SumGroup = vm.prod1Dimension.group().reduceSum(function (d) {
                        return +d.amount / 1000;
                    });

                    vm.prod2Dimension = vm.ndx.dimension(function (d) {
                        return d.productId.substring(0, 2);
                    });

                    vm.prod2SumGroup = vm.prod2Dimension.group().reduceSum(function (d) {
                        return +d.amount / 1000;
                    });

                    vm.prod3Dimension = vm.ndx.dimension(function (d) {
                        return d.productId.substring(0, 3);
                    });

                    vm.prod3SumGroup = vm.prod3Dimension.group().reduceSum(function (d) {
                        return +d.amount / 1000;
                    });

                    //Payment group dimension
                    vm.paymentDimension = vm.ndx.dimension(function (d) {
                        return Math.round(d.amount / 1000);
                    });
                    console.log(vm.paymentDimension);
                    vm.paymentGroup = vm.paymentDimension.group().reduceSum(function (d) {
                        return d.amount / 1000;
                    });
                    console.log(vm.paymentGroup);

                    vm.paymentRangeChartOptions = {
                        // title can be called by any stack layer.
                        title: function (d) {
                            return d.value;
                        }
                    };

                    vm.paymentRanageSelectChartPostSetupChart = function (c) {

                        c.yAxis().ticks(0);
                    };

                    vm.setupRangeChart = function (myRangeChart, chartOptions) {
                        var myRangeSelectChart = dc.barChart("#paymentRangeSelectChart");
                        //... setup the range chart
                        myRangeChart.rangeChart(myRangeSelectChart);
                    };

                    // data table does not use crossfilter group but rather a closure
                    // as a grouping function
                    vm.tableGroup = function (d) {

                        return d.bookingYear;
                    };

                    vm.piePostSetupChart = function (c) {
                        c.label(function (d) {
                            //return d.key + vm.productTypes[d.key];
                            return d.key;
                        })

                    };

                    vm.tablePostSetupChart = function (c) {
                        // dynamic columns creation using an array of closures
                        c.columns([
                            function (d) {
                                return d.bookingYear;
                            },
                            function (d) {
                                return d.productId;
                            },
                            function (d) {
                                return d.nkfAccount;
                            },
                            function (d) {
                                return currenFormat(d.amount);
                            }
                        ])
                            // (optional) sort using the given field, :default = function(d){return d;}
                            .sortBy(function (d) {
                                return d.amount;
                            })
                            // (optional) sort order, :default ascending
                            .order(d3.decending)
                            // (optional) custom renderlet to post-process chart using D3
                            .renderlet(function (table) {
                                table.selectAll(".dc-table-group").classed("info", true);
                            });
                    };

                    vm.dataTable = dc.dataTable("#dc-table-graph");
                    vm.dataTable.width(1200).height(800)
                        .dimension(vm.yearDimension)
                        .group(function (d) {
                            return "Einzelne Haushaltsansätze"
                        })
                        .size(10)
                        .columns([
                            function (d) {
                                return d.bookingYear;
                            },
                            function (d) {
                                return d.productId;
                            },
                            function (d) {
                                return d.account;
                            },
                            function (d) {
                                return '<span style="float:right">' + d.amount.format(0, 3, '.', ',') + '</span>';
                            }
                        ])
                        .sortBy(function (d) {
                            return d.amount;
                        })
                        .order(d3.descending);
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