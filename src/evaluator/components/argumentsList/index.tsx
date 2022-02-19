import { ChangeEvent } from "react";
import { Argument } from "../../model";
import { v4 as uuid } from 'uuid';

interface ArgumentsListProps {
    argumentValues: Argument[],
    updateArgument(newArgument: Argument): void
}

export const ArgumentsList = (props: ArgumentsListProps) => {

    const { updateArgument, argumentValues } = props;

    const onAddArgumentClick = () => updateArgument({ Id: uuid(), Name: 'newarg', Value: false });

    return <div>
        {argumentValues.map((val: Argument) => <ArgumentItem key={val.Id}
            argument={val}
            onChange={updateArgument} />)}
        <button onClick={onAddArgumentClick}>Add Argument</button>
    </div>
}

interface ArgumentItemProps {
    argument: Argument,
    onChange(newArgument: Argument): void
}

const ArgumentItem = (props: ArgumentItemProps) => {

    const { argument, onChange } = props;

    const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange({ ...argument, Name: event.currentTarget.value });
    }

    const onValueChange = (event: ChangeEvent<HTMLSelectElement>) => {
        onChange({ ...argument, Value: event.currentTarget.value === '0' ? false : true });
    }

    return <div>
        <input value={argument.Name} onChange={onNameChange} />
        <select value={argument.Value ? 1 : 0} onChange={onValueChange}>
            <option value={0}>False</option>
            <option value={1}>True</option>
        </select>
    </div>
}