import { MoverProfileEditForm } from '../_components/MoverProfileEditForm';

/**
 * 기사님 프로필 수정.
 * Figma: Mobile(1:11040)·Tablet(1:10785) → lg 미만, Desktop(1:10909) → lg+.
 */
const MoverProfileEditPage = () => {
  return (
    <section className="flex min-h-full w-full flex-col items-center overflow-x-clip bg-white px-6 pt-4 pb-10 md:px-[4.5rem] lg:px-0 lg:py-6">
      <MoverProfileEditForm />
    </section>
  );
};

export default MoverProfileEditPage;
