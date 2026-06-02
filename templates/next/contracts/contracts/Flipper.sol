// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @notice Minimal boolean flipper — mirrors the ink! flipper used in create-dot-app demos.
contract Flipper {
    bool private _value;

    event Flipped(bool newValue);

    constructor(bool initialValue) {
        _value = initialValue;
    }

    function flip() external {
        _value = !_value;
        emit Flipped(_value);
    }

    function get() external view returns (bool) {
        return _value;
    }
}
