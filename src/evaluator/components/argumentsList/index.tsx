import { ChangeEvent } from "react";
import { Argument } from "../../model";
import { v4 as uuid } from 'uuid';
import { Paper, TextField, Select, MenuItem, SelectChangeEvent, Button } from "@mui/material";

interface ArgumentsListProps {
    argumentValues: { [key: string]: Argument },
    updateArgument(newArgument: Argument): void
}

export const ArgumentsList = (props: ArgumentsListProps) => {

    const { updateArgument, argumentValues } = props;

    const onAddArgumentClick = () => updateArgument({ Id: uuid(), Name: 'newarg', Value: false });

    return <Paper style={{ padding: '1rem' }}>
        {Object.keys(argumentValues).map((key: string) => <ArgumentItem key={key}
            argument={argumentValues[key]}
            onChange={updateArgument} />)}
        <Button variant='outlined' onClick={onAddArgumentClick}>Add Argument</Button>
    </Paper>
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

    const onValueChange = (event: SelectChangeEvent) => {
        onChange({ ...argument, Value: event.target.value === 'false' ? false : true });
    }

    return <div style={{ paddingBlock: '0.5rem' }}>
        <TextField label='Argument Name' value={argument.Name} onChange={onNameChange} />
        <Select value={argument.Value ? 'true' : 'false'} onChange={onValueChange}>
            <MenuItem value={'false'}>False</MenuItem >
            <MenuItem value={'true'}>True</MenuItem >
        </Select>
    </div>
}