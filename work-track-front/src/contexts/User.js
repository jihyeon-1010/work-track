import React, { createContext, useState } from 'react';

// 현재 인증된 사용자 상태를 관리할 컨텍스트 생성
const UserContext = createContext({
    currentUser: null,
    setter: () => {},
});

const UserProvider = ({ children }) => {
  // 사용자 인증 정보를 저장
    const [currentUser, setCurrentUser] = useState(null);

    const setter = {
        setUser: (currentUser) => setCurrentUser(currentUser)
    }

    const value = { currentUser, setter };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
