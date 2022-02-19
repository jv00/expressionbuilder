

export abstract class BaseExpression { 
    
    abstract evaluate(): boolean;
} 

export class ConstantExpression extends BaseExpression { 
    
    _constantValue: boolean;

    constructor(constantValue: boolean) {
        super();

        this._constantValue = constantValue;   
    }

    evaluate(): boolean { return this._constantValue; }
} 

export class VariableExpression extends BaseExpression { 
    
    _variableValue: boolean;

    constructor(variableValue: boolean) {
        super();

        this._variableValue = variableValue;   
    }

    evaluate(): boolean { return this._variableValue; }
} 

export abstract class CalculatedExpression extends BaseExpression { 
    
    _leftOperand: BaseExpression;
    _rightOperand: BaseExpression;

    constructor(leftOperand: BaseExpression, rightOperand: BaseExpression) {
        super();

        this._leftOperand = leftOperand;   
        this._rightOperand = rightOperand;   
    }

    evaluate(): boolean { return this._leftOperand.evaluate() && this._rightOperand.evaluate(); }
}

export interface Argument {
    Id: string,
    Name: string,
    Value: boolean
}