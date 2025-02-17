
// SPDX-License-Identifier: MIT
pragma solidity >=0.6.2 <0.9.0;

import "./Pool.sol";
import "./Member.sol";
import "./Vault.sol";

contract Cycle{
    //----------------------------------
    // Type definitions
    //----------------------------------
    enum CycleStatus {initialising,allocateWinner,AUCTIONING,concluded} 
    //----------------------------------
    // Data
    //----------------------------------
    uint private id;  // unique Identification for each Cycle.
    
    Pool private parentPool;
    MembersList private poolMembersList;
    Member[] private payedMembers;
    Member[] private auctioningMembers;

    uint private cycleNo; // eg 1/10,2/10 etc

    Member private WinningMember; // The member that won this round/cycle

    CycleStatus public cycleStatus; // (initialising,allocateWinner, AUCTIONING,concluded) 
    
    // Events
    event PayIn(uint indexed _cycleNo, uint indexed _PoolId, address indexed _account, uint256 _amount);
    event PayWinner(address indexed _winner, uint256 _amount);

    //----------------------------------
    // Modifiers
    //----------------------------------
    modifier onlyWhenInitialising() {
        require(
            cycleStatus == CycleStatus.initialising,
            "This task can only be done when Initialising this Pool Cycle."
        );
        _;
    } // onlyWhenInitialising()

    modifier onlyWhenAllocatingWinnerForCycle() {
        require(
            cycleStatus == CycleStatus.allocateWinner,
            "This task can only be done when allocate Winner for this Pool Cycle."
        );
        _;
    } // onlyWhenAllocatingWinnerForCycle()

    modifier onlyWhenThePoolCycleHasConculded() {
        require(
            cycleStatus == CycleStatus.concluded,
            "This task can only be done when the Pool Cycle has Concluded."
        );
        _;
    } // onlyWhenThePoolCycleHasConculded()
    //----------------------------------
    // Functions
    //----------------------------------
    constructor(uint _cycleNo, Pool _parentPool, MembersList _poolMembersList) {
      cycleNo = _cycleNo;

      parentPool = _parentPool;
      poolMembersList = _poolMembersList;

    } // constructor()
    
    function payIn(Member _member) onlyWhenInitialising public{
        address account = _member.getAccount();
        require(!hasMemberPayed(_member), "Member already paid");
        (string memory name, uint256 amount) = parentPool.getRequirement_forContributionAsset();
        Vault vault = parentPool.getMap_ofVaults().getVault_withName(name);
        vault.transferContribution_toPool(_member.getAccount(), parentPool.getPoolId(), amount);
        payedMembers.push(_member);

        emit PayIn(cycleNo, parentPool.getPoolId(), account, amount);
    }
    
    function payWinner() onlyWhenAllocatingWinnerForCycle public{
        // require(WinningMember.getAccount() > 0, "Winner not selected");
        (string memory name, uint256 amount) = parentPool.getRequirement_forContributionAsset();
        Vault vault = parentPool.getMap_ofVaults().getVault_withName(name);
        for(uint i=0; i<poolMembersList.getLength(); i++){
            vault.transferContribution_fromPool(parentPool.getPoolId(), 
                                                poolMembersList.getMember_atIndex(i).getAccount(),
                                                WinningMember.getAccount(), amount);
            //todo: send incentive to contract
        }
        
        cycleStatus = CycleStatus.concluded;
        emit PayWinner(WinningMember.getAccount(), amount*poolMembersList.getLength());
    }
    
    function autionMemberStake(Member _member) public{
        cycleStatus = CycleStatus.AUCTIONING;
        auctioningMembers.push(_member);
    }
    //----------------------------------
    // Helper Functions
    //----------------------------------
    function hasMemberPayed(Member _member) public returns(bool){
        for(uint i=0; i<payedMembers.length; i++){
            if(payedMembers[i].getAccount() == _member.getAccount()){
                return true;
            }
        }
        return false;
    }
    
    function hasAllMembersPayed() public returns(bool){
        for(uint i=0; i<poolMembersList.getLength(); i++){
            if(!hasMemberPayed(poolMembersList.getMember_atIndex(i))){
                // todo: check if contribution time has passed and trigger auction
                return false;
            }
        }
        return true;
    }
    
    function setWinningPoolMember(Member _member)onlyWhenAllocatingWinnerForCycle public  {
      WinningMember = _member; 
    } // setWinningPoolMember()

    //----------------------------------
    // GUI Functions
    //----------------------------------
    function getCycleNo() public view returns(uint256) {
       return cycleNo;
    } // getCycleNo()
    
    function getMemberList() public view returns(MembersList){
        return poolMembersList;
    }

    //----------------------------------
    // External Functions
    //----------------------------------
    function setCycleStatusTo_allocateWinner() public onlyWhenInitialising {
        cycleStatus = CycleStatus.allocateWinner;
    }
    
    function isAuctioning() public view returns(bool){
        if(cycleStatus == CycleStatus.AUCTIONING)
        return true;
    }
    
    function isPoolCycleStatus_initialising() public view
      returns(bool _value) {
      
      _value = (cycleStatus == CycleStatus.initialising);

    } // isPoolCycleStatus_initialising()

    function isPooCycle_allocateWinner() public view
      returns(bool _value) {
      
      _value = (cycleStatus == CycleStatus.allocateWinner);

    } // isPooCycle_allocateWinner()
  
    function isPooCycle_concluded() public view
      returns(bool _value) {
      
      _value = (cycleStatus == CycleStatus.concluded);

    } // isPooCycle_concluded()
} //contract Cycle 


contract CyclesList{
    //----------------------------------
    // Type definitions
    //----------------------------------
    //----------------------------------
    // Data
    //----------------------------------
    address private poolAddress;
    Pool parentPool;
    MembersList private poolMembersList;

    Cycle[] private listOfCycles;

    // CycleList working data

    Member[] private listOfEligiblePoolMembers;
    Member[] private listOfWinningPoolMembers;
    //----------------------------------
    // Modifiers
    //----------------------------------

    /* EVENTS */
    event PayIn_toCycle(uint256 _cycleNo, uint256 _poolID, address _payer,uint256 _amount);

    //----------------------------------
    // Functions
    //----------------------------------
    constructor(Pool pool) {
        parentPool = pool;
        // poolAddress = _poolAddress;
        poolMembersList = parentPool.getMembersList();
        initialiseAvailiableWinningMembersArray();

    } // constructor()

    //----------------------------------
    // Helper Functions
    //----------------------------------
    
    function getPool() public view returns(Pool _pool){
        return _pool = parentPool;
    }
    
    function getLength() public view returns(uint) {
       return listOfCycles.length;
    } // getLength()

    function getCycle_atIndex(uint _index) public view returns(Cycle) {
       require(_index < listOfCycles.length);
       return listOfCycles[_index];
    } // getCycle_atIndex()

    function getCurrentCycle() public view returns(Cycle){
        return getCycle_atIndex(getLength() -1);
    }// getCurrentCycle()

    function removeCycle_atIndex(uint _index) public {
    //   // Move the last element to the deleted spot.
    //   // Delete the last element, then correct the length.
    //   require(_index < listOfCycles.length);

    //   // Only allowed to remove this cycle if is in "initialisation" status.
    //   Cycle _cycle = listOfCycles[_index].getCycle();
    //   require(_cycle.isPoolCycleStatus_initialising());
      
    //   listOfCycles[_index] = listOfCycles[listOfCycles.length-1];
    //   listOfCycles.pop();

    } // removeCycle_atIndex()

    function initialiseAvailiableWinningMembersArray() private {
       Member _member;
       for (uint i = 0; i < poolMembersList.getLength(); i++) {
         _member = poolMembersList.getMember_atIndex(i);
         listOfEligiblePoolMembers.push(_member);
       } // for loop 
    } // initialiseAvailiableWinningMembersArray()

    function removeMemberFromAvailiableWinningMembersArray(Member _member) private {
       Member _arrayMember;
       for (uint i = 0; i < listOfEligiblePoolMembers.length; i++) {
         _arrayMember = listOfEligiblePoolMembers[i];
         if (_arrayMember.getAccount() == _member.getAccount()){
          listOfEligiblePoolMembers[i] = listOfEligiblePoolMembers[listOfEligiblePoolMembers.length-1];
          listOfEligiblePoolMembers.pop();

          break;
         }
       } // for loop 
    } // removeMemberFromAvailiableWinningMembersArray()
    
    event Check(string status);
    function selectAWinningMember_forThisCycle() public returns(bool){
        Cycle _cycle = getCurrentCycle();
        require(!_cycle.isAuctioning(), "Auctioning not complete");
        
        // sell out stakes of defaulter
        if(!_cycle.hasAllMembersPayed()){
            for(uint i=0; i<_cycle.getMemberList().getLength(); i++){
                if(!_cycle.hasMemberPayed(_cycle.getMemberList().getMember_atIndex(i))){
                    _cycle.autionMemberStake(_cycle.getMemberList().getMember_atIndex(i));
                }
            }
            return false;//("Funds not complete, auctioning of stakes initiated");
        }
        
        // select winner
        // for testing the initial phase we will do Random
        uint poolEligibleWinnersSize = listOfEligiblePoolMembers.length;
        require(poolEligibleWinnersSize > 0);
    
        // find the random winner
        Member _winningMember;
        uint randomIndex = Utils.chooseRandomBetween(0, poolEligibleWinnersSize);   
        _winningMember = listOfEligiblePoolMembers[randomIndex];
    
        _cycle.setCycleStatusTo_allocateWinner();
        _cycle.setWinningPoolMember(_winningMember);
    
        removeMemberFromAvailiableWinningMembersArray(_winningMember);
        listOfWinningPoolMembers.push(_winningMember);
        
        _cycle.payWinner();
        
        // end pool if this is the last
        if(_cycle.getCycleNo() == poolMembersList.getLength()){
            emit Check("concluded");
            getPool().setPoolStatusTo_concluded();
            //todo: transfer all stakes back to members
        }
        else{
            addNewCycle();
        }

    //   return cycleNo;
    } // selectAWinningMember_forThisCycle()

    //----------------------------------
    // GUI Functions
    //----------------------------------
    function addNewCycle() public returns (uint _index){
         uint _cycleNo = listOfCycles.length +1;

         Cycle _NewCycle = new Cycle(_cycleNo, getPool(), poolMembersList);
         listOfCycles.push(_NewCycle);

         _index = _cycleNo -1;
        
    } // addNewCycle()

    function pay_toCurrentCycle(Member _payer) public{
        Cycle cycle = getCurrentCycle();
        cycle.payIn(_payer);
    }// pay_toCurrentCycle()

    //----------------------------------
    // External Functions
    //----------------------------------

} //contract CyclesList 