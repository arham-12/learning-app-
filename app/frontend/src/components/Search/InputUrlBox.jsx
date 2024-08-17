import React from 'react'

const InputUrlBox = ({Show,SetShow}) => {
    
  return (
    <dialog
    className={`h-screen ${
      Show ? "flex" : "hidden"
    } w-full z-0 absolute top-0 justify-center items-center bg-transparent`}
  >
    <div className="w-[80%] lg:w-[30%] h-[20%] lg:h-[40%] rounded-lg flex justify-center items-center flex-col gap-4 bg-black border border-primary">
      <h3 className="font-bold text-xl ">Chat by Url</h3>
      <div className="modal-action ">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button
 
            className="py-1 transition-all px-4 rounded-lg text-sm text-black bg-primary hover:bg-white hover:text-black mx-2"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              SetShow(false);
            }}
            className="py-1 px-4 transition-all rounded-lg text-sm text-black bg-primary hover:bg-white hover:text-black"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  </dialog>
  )
}

export default InputUrlBox