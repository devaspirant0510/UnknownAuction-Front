import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faFaceSmile, faImage } from '@fortawesome/free-solid-svg-icons';

const WritePost = ({ onClick }: { onClick: () => void }) => {
    return (
        <div className='flex justify-center py-2'>
            <div
                onClick={onClick}
                style={{ borderColor: 'rgba(186, 186, 186, 0.5)' }}
                className='flex items-center justify-between bg-white w-full  rounded-lg shadow px-4 py-3 border-1'
            >
                <div className='flex items-center gap-3 w-full'>
                    <img src='/img/default.png' className='rounded-full w-10 h-10 bg-[#F7F7F7]' />
                    <input
                        type='text'
                        placeholder='새로운 글 작성하기'
                        className='w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400'
                        readOnly
                    />
                </div>
                <div className='flex items-center gap-3 ml-4'>
                    <button disabled className='bg-transparent text-gray-400 cursor-not-allowed'>
                        <FontAwesomeIcon icon={faFaceSmile} />
                    </button>
                    <button disabled className='bg-transparent text-gray-400 cursor-not-allowed'>
                        <FontAwesomeIcon icon={faImage} />
                    </button>
                    <button disabled className='bg-transparent text-gray-400 cursor-not-allowed'>
                        <FontAwesomeIcon icon={faEllipsisH} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WritePost;
