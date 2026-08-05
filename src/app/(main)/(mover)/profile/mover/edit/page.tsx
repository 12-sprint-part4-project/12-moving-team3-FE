import { MoverProfileEditForm } from '../_components/MoverProfileEditForm';

/**
 * 기사님 프로필 수정.
 * Figma: 프로필 수정_기사님/Desktop(1:10909)
 */
const MoverProfileEditPage = () => {
  return (
    <section className="flex min-h-full w-full flex-col items-center overflow-x-clip bg-white px-6 py-4 md:px-[4.5rem] lg:px-0 lg:py-6">
      <MoverProfileEditForm />
    </section>
  );
};

export default MoverProfileEditPage;
