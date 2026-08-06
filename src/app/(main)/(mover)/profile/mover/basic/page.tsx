import { MoverBasicInfoEditForm } from '../_components/MoverBasicInfoEditForm';

/** 기사님 기본정보 수정 */
const MoverBasicInfoEditPage = () => {
  return (
    <section className="flex min-h-full w-full flex-col items-center overflow-x-clip bg-white px-6 pt-4 pb-10 md:px-[4.5rem] lg:px-0 lg:py-6">
      <MoverBasicInfoEditForm />
    </section>
  );
};

export default MoverBasicInfoEditPage;
