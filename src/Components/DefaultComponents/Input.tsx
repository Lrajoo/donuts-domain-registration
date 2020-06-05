import React, { FC } from "react";

interface SimpleInputProps {
    title: string
    placeholder: string
    width?: string
    changed(event: React.ChangeEvent<HTMLInputElement>): void
}

export const SimpleInput: FC<SimpleInputProps> = (props: SimpleInputProps) => (
    <>
        <h4>{props.title}</h4>
        <input
            style={{marginBottom: '15px', padding: '5px', border: '1px solid black', backgroundColor: 'white', borderRadius: '5px', width: props.width || '100%'}}
            placeholder={props.placeholder}
            onChange={(event) => {
                event.preventDefault()
                props.changed(event)
            }}
        />
    </>
)