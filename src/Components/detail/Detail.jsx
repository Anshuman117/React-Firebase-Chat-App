import React from 'react'
import avatar from '../../assets/avatar.png'
import arrowUp from '../../assets/arrowUp.png'
import arrowDown from '../../assets/arrowDown.png'
import download from '../../assets/download.png'





const Detail = () => {
  return (
    <div className='details flex-1'>
      <div className="user flex flex-col items-center gap-5 px-[20px] py-[30px] border-b border-[#dddddd35] ">
        <img src={avatar} alt="" />
        <h2>Anshuman</h2>
        <p>Lorem ipsum dolor sit amet consectetur</p>

      </div>
      <div className='info'>
      <div className='options'>
          <div className="title">
            <span>Chat Setting</span>
            <img src={arrowUp} alt="" />

          </div>

        </div>
        <div className='options'>
          <div className="title">
            <span>Chat Setting</span>
            <img src={arrowUp} alt="" />

          </div>

        </div>
        <div className='options'>
          <div className="title">
            <span>Privacy % help</span>
            <img src={arrowUp} alt="" />

          </div>

        </div>
        <div className='options'>
          <div className="title">
            <span>Shared photos</span>
            <img src={arrowDown} alt="" />

          </div>
          
          <div className="photo">
            <div className="photoItem">
              <div className="photoDetail">

              <img  src=" https://upload.wikimedia.org/wikipedia/commons/c/c9/Iowa_City_Downtown_June_2021_%28cropped%29.jpg" alt="" />
            <span>Photo_Iova.png</span>
              </div>
            <img src={download} alt="" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">

              <img src=" https://upload.wikimedia.org/wikipedia/commons/c/c9/Iowa_City_Downtown_June_2021_%28cropped%29.jpg" alt="" />
            <span>Photo_Iova.png</span>
              </div>
            <img src={download} alt="" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">

              <img src=" https://upload.wikimedia.org/wikipedia/commons/c/c9/Iowa_City_Downtown_June_2021_%28cropped%29.jpg" alt="" />
            <span>Photo_Iova.png</span>
              </div>
            <img src={download} alt="" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">

              <img src=" https://upload.wikimedia.org/wikipedia/commons/c/c9/Iowa_City_Downtown_June_2021_%28cropped%29.jpg" alt="" />
            <span>Photo_Iova.png</span>
              </div>
            <img src={download} alt="" />
            </div>
          </div>

        </div>
        <div className='options'>
          <div className="title">
            <span>Shared Files</span>
            <img src={arrowUp} alt="" />

          </div>

        </div>
        <div className='options'>
          <div className="title">
            <span>Chat Setting</span>
            <img src={arrowUp} alt="" />

          </div>

        </div>
        <button>Block User</button>

      </div>
      

      

    </div>
  )
}

export default Detail;