$(document).ready(function () {
    var greetingPanel = $('#greetingPanel'),
        gameInfo = greetingPanel.find('#gameInfo p'),
        categoryPicture = greetingPanel.find('.categoryPictures'),
        playersNameField = greetingPanel.find('#playersName'),
        submitGreetingPanel = greetingPanel.find('#submitButton'),
        memoryGamePanel = $('#memoryGamePanel'),
        playersName = "Anonymus",
        category,
        numberOfRows = 4,
        numberOfColumns = 6,
        numberOfGameCards = numberOfRows * numberOfColumns,
        gameCardsIdsArray = [],
        categoryFruitsPictures = [
          '<img src="Pics/Fru/fru1.jpg" alt="fru1" class="img img-responsive"/>',
          '<img src="Pics/Fru/fru2.jpg" alt="fru2" class="img img-responsive"/>',
          '<img src="Pics/Fru/fru3.jpg" alt="fru3" class="img img-responsive"/>',
          '<img src="Pics/Fru/fru4.jpg" alt="fru4" class="img img-responsive"/>',
          '<img src="Pics/Fru/fru5.jpg" alt="fru5" class="img img-responsive"/>',
          '<img src="Pics/Fru/fru6.jpg" alt="fru6" class="img img-responsive"/>',
          '<img src="Pics/Fru/fru7.jpg" alt="fru7" class="img img-responsive"/>',
          '<img src="Pics/Fru/fru8.jpg" alt="fru8" class="img img-responsive"/>',
          '<img src="Pics/Fru/fru9.jpg" alt="fru9" class="img img-responsive"/>',
          '<img src="Pics/Fru/fru10.jpg" alt="fru10" class="img img-responsive"/>',
          '<img src="Pics/Fru/fru11.jpg" alt="fru11" class="img img-responsive"/>',
          '<img src="Pics/Fru/fru12.jpg" alt="fru12" class="img img-responsive"/>'
        ],
        categoryVegetablesPictures = [
          '<img src="Pics/Veg/veg1.jpg" alt="veg1" class="img img-responsive"/>',
          '<img src="Pics/Veg/veg2.jpg" alt="veg2" class="img img-responsive"/>',
          '<img src="Pics/Veg/veg3.jpg" alt="veg3" class="img img-responsive"/>',
          '<img src="Pics/Veg/veg4.jpg" alt="veg4" class="img img-responsive"/>',
          '<img src="Pics/Veg/veg5.jpg" alt="veg5" class="img img-responsive"/>',
          '<img src="Pics/Veg/veg6.jpg" alt="veg6" class="img img-responsive"/>',
          '<img src="Pics/Veg/veg7.jpg" alt="veg7" class="img img-responsive"/>',
          '<img src="Pics/Veg/veg8.jpg" alt="veg8" class="img img-responsive"/>',
          '<img src="Pics/Veg/veg9.jpg" alt="veg9" class="img img-responsive"/>',
          '<img src="Pics/Veg/veg10.jpg" alt="veg10" class="img img-responsive"/>',
          '<img src="Pics/Veg/veg11.jpg" alt="veg11" class="img img-responsive"/>',
          '<img src="Pics/Veg/veg12.jpg" alt="veg12" class="img img-responsive"/>'
        ],
        picturesArrayForGame = [],
        clickedCardsArray = [],
        foundPairsArray = [],
        remainingTime = 90,
        scoreCounter = 0,
        gameInterval;

    var showMemoryPanel = function () {
        memoryGamePanel.append("<p id='greetingText'>Szia " + playersName +
                "!</p><br><button class='btn btn-success' \n\
                              id='startPlayButton' type='submit'>\n\
                              INDULHAT A JÁTÉK?</button>").fadeIn(500);
    };

    var showGameCards = function (row, column) {
        var gameCardsRowsArray = [];
        var i = -1;

        for (var x = 1; x <= row; x++) {
            gameCardsRowsArray.push('#gameCardsRow' + x);
            memoryGamePanel.append("<div class = 'row'>\n\
                                   <ul class='list list-unstyled list-inline'\n\
                                   id='gameCardsRow" + x + "'></ul></div>");
        }
        while (i < gameCardsRowsArray.length - 1) {
            i++;
            for (var y = 1; y <= column; y++) {
                memoryGamePanel.find(gameCardsRowsArray[i])
                        .append("<li class='gameCards \n\
                                           gameCardsBackSide' id='card'></li>");
            }
        }
    };

    var pushIntoGameCardsIdsArray = function () {
        var cardNumber = 0;
        while (gameCardsIdsArray.length < numberOfGameCards) {
            cardNumber++;
            gameCardsIdsArray.push('#card' + cardNumber);
        }
    };

    var addGameCardsIdToListItems = function () {
        memoryGamePanel.find("li[id^='card']").each(function (i) {
            $(this).attr('id', 'card' + (i + 1));
        });
    };

    var createPicturesArrayForGame = function (category) {
        (category === "fruits") ? category = categoryFruitsPictures :
                category = categoryVegetablesPictures;
        picturesArrayForGame = category.slice(0, (numberOfGameCards / 2));
        picturesArrayForGame = picturesArrayForGame.concat(picturesArrayForGame);
    };

    var randomizePictures = function (categoryPicturesArray) {
        var array = categoryPicturesArray;
        var length = categoryPicturesArray.length;
        var i, x;
        for (; 0 < length; length--) {
            i = Math.floor(Math.random() * length);
            x = array[length - 1];
            array[length - 1] = array[i];
            array[i] = x;
        }
    };
    var addPicturesToGameCards = function (randomizedPicturesArray) {
        for (var i = 0; i < gameCardsIdsArray.length; i++) {
            $(gameCardsIdsArray[i]).append(randomizedPicturesArray[i]);
        }
    };

    var showTimerAndScorePanel = function () {
        $('#timerAndScoresPanel').fadeIn(100);
        $('#scorePanel').append("<p id='score'>" + scoreCounter + "</p>");
        $('#timerPanel').append("<p id='timer'>" + remainingTime + "</p>");
    };
    
    var countRemainingTime = function () {
        var minutes = Math.floor(remainingTime / 60);
        var seconds = remainingTime - (minutes * 60);

        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        $('#timer').html(minutes + ':' + seconds);
        remainingTime--;
        endOfGame();
    };
    
    var hideMemoryGamePanelIfTheGameEnds = function(){
        clearInterval(gameInterval);
        memoryGamePanel.fadeOut(100);
        $('#timerPanelText').html('MEGMARADT IDŐ');
        $('#scorePanelText').html('ÖSSZPONTSZÁM');
        $('#summaryPanel').slideDown(1000);
        $('#foundPairsPointsRow').slideDown(1000);
        $('#foundPairsPoints').append(scoreCounter);
    };
    
    var endOfGame = function(){
        var pointsForSeconds = (remainingTime+1)*10;
        var bonusPoints = 500;
        if (remainingTime === -1) {
              hideMemoryGamePanelIfTheGameEnds();
        } else if (foundPairsArray.length === numberOfGameCards / 2) {
              hideMemoryGamePanelIfTheGameEnds();
              $('#rowOfPointsForRemainingTime').slideDown(1000);
              $('#pointsForRemainingTime').append(pointsForSeconds);
              scoreCounter += pointsForSeconds;
              $('#bonusPointsRow').slideDown(1000);
              $('#bonusPoints').append(bonusPoints);
              scoreCounter += bonusPoints;
              $('#score').html(scoreCounter);
        }
        $('#replayButtonRow').fadeIn(1000);
    };



    greetingPanel.fadeIn(1500);

    $('#gameInfoButton').click(function () {
        if (gameInfo.hasClass('showGameInfo')) {
            gameInfo.removeClass('showGameInfo').slideUp(500);
            $(this).empty().append('Játékleírás');
        } else {
            gameInfo.addClass('showGameInfo').slideDown(500);
            $(this).append(' bezárása');
        }
    });

    playersNameField.keyup(function () {
        playersName = $(this).val();
    });

    categoryPicture.click(function () {
        var anotherCategoryPicture = $(this).closest('li').siblings()
                .find('.categoryPictures');
        $(this).prev().fadeToggle(500);
        $(this).closest('div').find('p').removeClass('showCategoryError').next()
                .remove('span');
        $(this).toggleClass('selectedCategoryPicture');
        if (anotherCategoryPicture.hasClass('selectedCategoryPicture')) {
            anotherCategoryPicture.removeClass('selectedCategoryPicture')
                    .prev().fadeOut(500);
        }
        ;
    });

    submitGreetingPanel.click(function () {
        (categoryPicture.hasClass('selectedCategoryPicture')) ?
                ($('#fruits').hasClass('selectedCategoryPicture')) ?
                category = "fruits" : category = "vegetables" :
                $('#gameCategory p').addClass('showCategoryError')
                .after('<span class="glyphicon glyphicon-exclamation-sign" >\n\
                        </span>');
        if (category !== undefined) {
            greetingPanel.fadeOut(100);
            showMemoryPanel();
        }
    });

    memoryGamePanel.on('click', '#startPlayButton', function () {
        $(this).addClass('hideStartPlayButton').fadeOut(100);
        $('#greetingText').after("<p'>JÓ SZÓRAKOZÁST!</p>");
        showGameCards(numberOfRows, numberOfColumns);
        memoryGamePanel.fadeIn(100);
        pushIntoGameCardsIdsArray();
        createPicturesArrayForGame(category);
        addGameCardsIdToListItems();
        randomizePictures(picturesArrayForGame);
        addPicturesToGameCards(picturesArrayForGame);
        showTimerAndScorePanel();
        gameInterval = setInterval(countRemainingTime, 1000);
        
        memoryGamePanel.find('.list').on('click', '.gameCards', function () {
            var image = $(this).find('img');
            $(this).addClass('hiddenGameCardsBackSide selected');
            image.addClass('selectedGameCardPicture').fadeIn(500);
            clickedCardsArray.push($(this).find('img').attr('alt'));
            if (clickedCardsArray.length === 2) {
                if (clickedCardsArray[0] !== clickedCardsArray[1]) {
                    $('.selected').find('img')
                            .removeClass('selectedGameCardPicture')
                            .slideUp(1200);
                    $('.selected').removeClass('hiddenGameCardsBackSide');
                    memoryGamePanel.find('.gameCards').removeClass('selected');
                    clickedCardsArray = [];
                } else if (clickedCardsArray[0] === clickedCardsArray[1]) {
                    foundPairsArray.push($('.selected').find('img').attr('alt'));
                    $('.selected').addClass('complete').removeClass('selected');
                    scoreCounter += 50;
                    $('#score').html(scoreCounter);
                    clickedCardsArray = [];
                }
            }
            endOfGame();
        });
        
        $('#replayButton').click(function(){
            location.reload();
        });
    });
});





