import React, { use } from 'react'

function FormSavedBuilderPage({ params }: { params: Promise<{ id: string }> })
{
    const { id } = use(params);
    return (
        <div>{id.toString()}</div>
    )
}

export default FormSavedBuilderPage
