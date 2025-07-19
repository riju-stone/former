import React from 'react'
import FormTypes from '@/lib/formTypes'

function ValidationGroupComponent({ validationGroup }: { validationGroup: any }) {
  return (
    <div className='w-full flex flex-col gap-2'>
      <div className='w-full flex-col items-center gap-2'>
        {validationGroup.map((validation: any) => (
          <div key={validation.tag} className='w-full flex items-center gap-2 my-2'>
            <label className='text-[12px] text-gray-500 font-[500] text-nowrap'>{validation.name}</label>
            <input className='h-[32px] w-full bg-transparent px-2 py-[6px] text-[12px] text-gray-950 outline-none border-[1px] border-gray-200 rounded-lg' type={validation.type} placeholder={validation.placeholder} value={validation.defaultValue} onChange={(e) => { }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ValidationGroupComponent