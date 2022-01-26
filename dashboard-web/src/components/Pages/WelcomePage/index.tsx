import { CButton } from '@coreui/react';
import AnimatedSvg from './../../AnimatedSVG';

const WelcomePage = () => {
    return (
        <div className='flex h-screen justify-center items-center'>
            <div>
                <p className='flex justify-center text-7xl pb-5'>Welcome to</p>
                <div className='mb-40'>
                    <AnimatedSvg/>
                </div>
                <p className='flex justify-center text-3xl -mb-0'>On this dashboard, you can add all the widgets you want,</p>
                <p className='flex justify-center text-3xl'>you can place them as you want and thus create your environment as you wish</p>
                <div className='flex justify-center mt-20'>
                    <CButton href='/login' color='success'>Create your Dashboard</CButton>
                </div>
            </div>
        </div>
    )
}

export default WelcomePage;



