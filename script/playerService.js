angular.module('app')

.service('playerService', function(_, $q, $timeout) {

  var players = [];
  var idSeq = 0;
  var maxTransactionsDisplayed = 15;
  var sessionStatusChangePromise = null;

  var initialSession = localStorage.transactionCalculatorSession;

  function cachePlayers() {
    var playerInfos = [];
    _.each(players, function(player) {
        playerInfo = { name:player.name, transactions:player.transactions, txamound: player.txamount };
        playerInfos.push(playerInfo);
    });
    localStorage.transactionCalculatorSession = JSON.stringify(playerInfos);
    if(sessionStatusChangePromise) {
      sessionStatusChangePromise.resolve(true);
    }
  }
  
  var addPlayer = function(name, amount, disableCache) {
    var txamount = 0;
    if(typeof amount == 'undefined') txamount = 5000;
    var newPlayer = new gamePlayer(name, txamount);
    players.push(newPlayer);
    if(!disableCache) cachePlayers();
    return newPlayer;
  }

  var gamePlayer = function(name, amount) {
    var self = this;
    
    var vm = this;
    
    vm.id = players.length;
    vm.name = name;
    vm.properties = [];
    vm.transactions = [];
    
    var txamount = 5000;
    if(typeof amount != 'undefined') txamount = amount;
    
    vm.undoLastTx = function() {
      var self = this;
      if (!self.transactions || self.transactions.length === 0) return;
      self.transactions = _.dropRight(self.transactions, 1);
       cachePlayers();
    };
    vm.totalAmount = function() {
      var self = this;
      return _.sum(self.transactions); 
    };
    vm.transactAmount = function(amount, disableCache) {
      var self = this;
      if (amount) self.transactions.push(amount);
       if(!disableCache) cachePlayers();
    };
    vm.getTransactions = function() {
      var self = this;
      return self.transactions;
    }
    vm.topTransactions = function() {
      var self = this;
      return _.takeRight(self.transactions, maxTransactionsDisplayed);
    }
    //now we can perform functions on ourself
    if(txamount) vm.transactAmount(txamount);

    self.vm = vm;
    
    return self;
  }

  var getPlayer = function(id) {
    return _.find(players, {
      id: id
    });
  }

  var allPlayers = function() {   
    return players;
  }
   
  var getTransactions = function() {
    
  }
  
  function fetchSession(rawSessionString) {
    players = [];
    var sessionString = rawSessionString ? rawSessionString : localStorage.transactionCalcualtorSession;
    if(sessionString) {
      var playerInfos = JSON.parse(sessionString);
      _.each(playerInfos, function(playerInfo) {
        var transactions = playerInfo.transactions;  
        var newPlayer = addPlayer(playerInfo.name, 0);
        _.each(transactions, function(amount) { 
            newPlayer.transactAmount(amount);
        });  
      });
      return true;
    }
    return false;
  }
  
  function sessionExists() {
    if(localStorage.transactionCalculatorSession) return true;
    return false;
  }
  
  function restoreInitialSession() {
    fetchSession(initialSession);
    initialSession = null;
    cachePlayers();
    return players;
  }
  
  function deletePlayer(player) {
    var index = 0;
    for(index=0;index < players.length; index++) {
      if(players[index].name == player.name) break;
    }
    players.splice(index, 1);
    return players;
  }
  
  var defaults = function() {
    addPlayer('scott');
    addPlayer('gabe');
    addPlayer('michelle');
    addPlayer('matthew');
    addPlayer('Community',0)
  }

  return {
    addPlayer: addPlayer,
    getPlayer: getPlayer,
    allPlayers: allPlayers,
    defaults: defaults,
    getTransactions: getTransactions,
    fetchSession: fetchSession,
    sessionExists: sessionExists,
    restoreInitialSession: restoreInitialSession,
    deletePlayer: deletePlayer
  }

});