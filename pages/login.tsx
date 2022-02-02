import React, { FC } from 'react';
import { getProviders, signIn } from 'next-auth/react'
import { Provider } from 'next-auth/providers'
import Image from 'next/image';

interface IProps {
    providers: Provider[];  
}

const login: FC<IProps> = ({ providers }) => {
    return (
        <div className='flex flex-col items-center bg-black min-h-screen w-full justify-center space-y-5'>
            <Image height={100} width={100} src='https://links.papareact.com/9xl' alt='' />
            {Object.values(providers).map((provider) => (
                <div key={provider.name}>
                    <button 
                        className='bg-[#18D860] text-white p-5 rounded-lg '
                        onClick={() => signIn(provider.id, {callbackUrl: '/'})}
                    >
                        Login with {provider.name}
                    </button>
                </div>
            ))}
        </div>
    )
}

export default login;

export async function getServerSideProps() {
    const providers = await getProviders()

    return {
        props: {
            providers
        }
    }
}