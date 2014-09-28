'use strict';

/* Controllers */

var pradelnicekControllers = angular.module('pradelnicek.Controllers', []);

pradelnicekControllers.controller('WashmachineCtrl', ['$scope', 'pClothes', '_',
    function ($scope, pClothes, _) {

        /*VARIABLES*/
        var basketsCount = 3;
        var pointer = -1;
        var mainCloth = undefined;
        $scope.clothesData = pClothes.query({}, function callback(res) {
                console.log("$clothesData.length=" + res.length);
            }
        );


        /*KEYBORD HANDLING*/
        /**
         * drzi zaznam o naposledy klliknutej klavese , keyDown | keyUp
         * @type {{key: null, indicator: boolean}}
         */
        var keyPressedBundle = {
            'lock': false,
            'key': null,
            'indicator': false
        };
        document.addEventListener("keydown", function onKeyDownCallback(event) {
            var keyCode = event.keyCode;
            if (keyPressedBundle['key'] == keyCode && keyPressedBundle['indicator']) {
                return;
            }

            if (keyPressedBundle['lock']) {
                return;
            }

            switch (keyCode) {
                case 37: //LEFT
                    $scope.prevCloth();
                    break;
                case 39: //RIGHT
                    $scope.nextCloth();
                    break;
                case 96: //0 remove basket
                    $scope.unpickBasket();
                    break;
                case 97: //1
                case 98: //2
                case 99: //3
                case 100: //4
                case 101: //5
                case 102: //6
                case 103: //7
                    $scope.pickBasket(keyCode - 97);
                    break;
                default :
                    return;
            }
            event.preventDefault();
            keyPressedBundle['indicator'] = true;
            keyPressedBundle['key'] = keyCode;
            //musim refresh inak neduje angular na zmeny
            $scope.$apply();
        }, false);
        document.addEventListener('keyup', function onKeyUpCallback(event) {
            if (keyPressedBundle['key'] === event.keyCode) {
                event.preventDefault();
                keyPressedBundle['key'] = null;
                keyPressedBundle['indicator'] = false;
            }
        }, false);


        /*METHODS WITH LOGIC*/
        $scope.getSortedClothesCount = function () {
            var filteredClothes = $scope.clothesData.filter(function (value) {
                return !angular.isUndefined(value.basket);
            });
            return filteredClothes.length;
        };
        $scope.getClothesInBasket = function (basketIndex) {
            return $scope.clothesData.filter(function (value) {
                return !angular.isUndefined(value.basket) && value.basket === basketIndex;
            });
        };
        $scope.getPercentageForBasket = function (basketIndex) {
            var basketClothes = $scope.clothesData.filter(function (value) {
                return !angular.isUndefined(value.basket) && value.basket === basketIndex;
            });
            return ((basketClothes.length / $scope.clothesData.length) * 100) + '%';
        };
        $scope.getBackgroundColorForBasket = function (basketIndex) {
            switch (basketIndex) {
                case 0:
                    return '#61BD6D';
                case 1:
                    return '#54ACD2';
                case 2:
                    return '#9365B8';
                case 3:
                    return '#F7DA64';
                case 4:
                    return '#FBA026';
                case 5:
                    return '#EB6B56';
                case 6:
                    return '#FAACF1';
                default :
                    return '#f5f5f5';
            }
        };

        $scope.getBasketsCount = function () {
            return new Array(basketsCount);
        };
        $scope.addBasket = function () {
            basketsCount = (basketsCount < 7) ? ++basketsCount : 7;
            console.log("BasketsCount=" + basketsCount);
        };
        $scope.removeBasket = function () {
            basketsCount = (basketsCount > 1) ? --basketsCount : 1;
            console.log("BasketsCount=" + basketsCount);
            cleanUnusedBasket(basketsCount);
        };
        $scope.pickBasket = function (btnIndex) {
            //lebo volam aj cez event klaves + ak niesom v pasme 0-lenght nejdem
            if (btnIndex >= basketsCount || btnIndex < 0 ||
                (pointer < 0 || pointer >= $scope.clothesData.length)) {
                return;
            }
            keyPressedBundle.lock = true;
            mainCloth.basket = btnIndex;
            var delayedNext = _.debounce($scope.nextCloth, PICK_DELAY);
            delayedNext(true);
        };
        $scope.unpickBasket = function (cloth) {
            if (cloth) {
                delete cloth.basket;
            } else {
                delete mainCloth.basket;
            }
        };


        $scope.nextCloth = function (refreshScope) {
            pointerInc();
            mainCloth = $scope.clothesData[pointer];
            //ak som cez event (klavesnica) tak musim prekreslit
            if (refreshScope) {
                $scope.$apply();
                //pri picknuti lockujem a po presune (delay) odlocknem
                keyPressedBundle.lock = false;
            }
        };
        $scope.prevCloth = function () {
            pointerDec();
            mainCloth = $scope.clothesData[pointer];
        };
        $scope.firstCloth = function () {
            pointer = -1;
            console.log("Pointer = " + pointer);
            mainCloth = $scope.clothesData[pointer];
        };
        $scope.lastCloth = function () {
            pointer = $scope.clothesData.length;
            console.log("Pointer = " + pointer);
            mainCloth = $scope.clothesData[pointer];
        };
        $scope.movePointer = function (index) {
            pointer = index;
            mainCloth = $scope.clothesData[pointer];
            console.log("Click na stavovy riadok, pozicia=" + pointer);
        };
        $scope.movePointerToLeft = function (index) {
            var bgConst = pointer > 4 ? 4 : pointer;
            pointer = pointer + (index - bgConst);
            mainCloth = $scope.clothesData[pointer];
            console.log("Click na lavy thumb, pozicia=" + pointer);
        };
        $scope.movePointerToRight = function (index) {
            pointer = pointer + (index + 1);
            mainCloth = $scope.clothesData[pointer];
            console.log("Click na pravy thumb, pozicia=" + pointer);
        };


        $scope.getMainClothImg = function () {
            if (angular.isUndefined(mainCloth)) {
                return (pointer < 0) ? "img/washmachine_placeholder.png" : "img/washmachine_placeholder.png";
            }
            return mainCloth.imgUrl ? mainCloth.imgUrl : 'img/photo_placeholder.jpg';
        };
        $scope.getMainClothBasket = function () {
            if (angular.isUndefined(mainCloth)) {
                //len ak aby getBackgroundColorForBasket hodil default
                return -1;
            }
            return mainCloth.basket;
        };
        $scope.getClothesOnLeft = function () {
            var leftBorder = pointer - CLOTHES_ON_SIDE_COUNT < 0 ? 0 : pointer - CLOTHES_ON_SIDE_COUNT;
            var rightBorder = pointer < 0 ? 0 : pointer;
            return $scope.clothesData.slice(leftBorder, rightBorder);
        };
        $scope.getClothesOnRight = function () {
            var leftBorder = pointer > $scope.clothesData.length - 1 ? $scope.clothesData.length : pointer + 1;
            var rightBorder = pointer + CLOTHES_ON_SIDE_COUNT + 1;
            return $scope.clothesData.slice(leftBorder, rightBorder);
        };

        $scope.isPickingMode = function () {
            return (pointer > -1) && (pointer < $scope.clothesData.length);
        };
        $scope.isPrevBtnVisible = function () {
            return  pointer > -1;
        };
        $scope.isNextBtnVisible = function () {
            return pointer < $scope.clothesData.length;
        };
        $scope.isFinishBtnVisible = function () {
            return pointer >= $scope.clothesData.length;
        };
        $scope.isMainClothAtIndex = function (index) {
            return pointer === index;
        };

        $scope.moveToResultSection = function () {
            $('html, body').animate({
                scrollTop: $("#result-row").offset().top
            }, 1000);
        };
        $scope.sendEmail = function () {
            var emailSubject = "Prádelníček - pranie dňa " + createEmailDate(new Date());
            var emailTextHtml = JSON.stringify($scope.clothesData);
            $.ajax({
                'type': 'POST',
                'url': 'https://mandrillapp.com/api/1.0/messages/send.json',
                'data': {
                    'key': 'T_9ZKsoB9JJ4IoX1Tk5DFA',
                    'message': {
                        'from_email': 'pradelnicek@gmail.com',
                        'to': [
                            {
                                'email': 'petranikpeter@gmail.com',
                                'name': 'Name',
                                'type': 'to'
                            }
                        ],
                        'autotext': 'true',
                        'subject': emailSubject,
                        'html': emailTextHtml
                    }
                }
            }).done(function (response) {
                console.log(JSON.stringify(response));
            });
        };

        function pointerInc() {
            ++pointer;
            //check
            pointer = ((pointer < $scope.clothesData.length) ? pointer : $scope.clothesData.length);
            console.log("Pointer = " + pointer);
        }

        function pointerDec() {
            --pointer;
            //check
            pointer = (pointer < 0) ? -1 : pointer;
            console.log("Pointer = " + pointer);
        }

        function cleanUnusedBasket(basketNumber) {
            var i;
            for (i = 0; i < $scope.clothesData.length; i += 1) {
                if ($scope.clothesData[i].basket && $scope.clothesData[i].basket === basketNumber) {
                    delete $scope.clothesData[i].basket;
                }
            }
        }

        /**
         * Cas
         * @param d new Date
         * @return {string} hh:mm dd/mm/yy
         */
        function createEmailDate(d) {
            var min = d.getMinutes();
            var hh = d.getHours();
            var dd = d.getDate();
            var mm = d.getMonth() + 1;
            var yy = d.getFullYear();

            if (min < 10) min = '0' + min;
            if (hh < 10) hh = '0' + hh;
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;

            return hh + ':' + min + ' ' + dd + '/' + mm + '/' + yy;
        }

        /* CONSTATNTS */
        var PICK_DELAY = 700;
        var CLOTHES_ON_SIDE_COUNT = 4;
    }
]);