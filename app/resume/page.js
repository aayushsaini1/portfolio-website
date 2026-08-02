import WorkHeader from '../../components/WorkHeader';
import HoloResumeWrapper from '../../components/holocloth/HoloResumeWrapper';

export const metadata = {
  title: "Resume — Interactive Holographic Cloth",
  description: "Interactive holographic cloth resume of Aayush Saini, Lead UX Designer & Product Designer. View the 3D draped resume and download official PDF.",
  openGraph: {
    title: "Aayush Saini — Resume (Interactive Holographic Cloth)",
    description: "Interactive holographic cloth resume of Aayush Saini, Lead UX Designer.",
  },
};

export default function ResumePage() {
  return (
    <div className="flex flex-col h-screen h-[100dvh] w-full overflow-hidden" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      <WorkHeader />
      <main className="relative flex-1 w-full h-full overflow-hidden">
        <HoloResumeWrapper />
      </main>
    </div>
  );
}
