import React from 'react'
import UserInfo from './userInfo/UserInfo'
import ChatList from './chatList/ChatList'
const List = () => {
  return (
    <div className='flex h-full flex-col bg-slate-900/20'>
        <UserInfo/>
        <ChatList/>
    </div>
  )
}

export default List
