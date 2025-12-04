import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';

import { cn } from '@heroui/react';
import {
  type PageLayout,
  type RenderPageProps,
  SpecialZoomLevel,
  Viewer,
  ViewMode,
  Worker,
} from '@react-pdf-viewer/core';
import type { ToolbarSlot } from '@react-pdf-viewer/default-layout';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';

import { toolbarPlugin } from '@react-pdf-viewer/toolbar';

const renderPage = (props: RenderPageProps) => {
  return (
    <>
      {props.canvasLayer.children}
      <div
        style={
          {
            //   userSelect: 'none',
          }
        }
      >
        {props.textLayer.children}
      </div>
      {props.annotationLayer.children}
    </>
  );
};

export const PdfViewer = ({
  src,
  toolbar = false,
  initialPage = 0,
  className,
  render,
}: {
  src: string;
  toolbar?: boolean;
  initialPage?: number;
  className?: string;
  render?: () => { endPage: number; startPage: number };
}) => {
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;
  const pageNavigationPluginInstance = pageNavigationPlugin();

  const pageLayout: PageLayout = {
    transformSize: ({ size }) => ({
      height: size.height + 10,
      width: size.width + 10,
    }),
  };

  return (
    <div
      className={cn(
        'h-full w-full relative bg-light',
        toolbar ? 'pt-14' : 'pt-0',
        className,
      )}
    >
      {toolbar ? (
        <div className="justify-center w-fit m-auto rounded absolute top-2 left-0 right-0 z-50 hidden md:flex">
          <Toolbar>
            {(slots: ToolbarSlot) => {
              const {
                CurrentPageInput,
                EnterFullScreen,
                GoToNextPage,
                GoToPreviousPage,
                NumberOfPages,
                ShowSearchPopover,
                Zoom,
                ZoomIn,
                ZoomOut,
                SwitchViewMode,
              } = slots;
              return (
                <div className="flex items-start gap-2 px-1 pt-1 w-fit rounded bg-transparent">
                  <div>
                    <ShowSearchPopover />
                  </div>
                  <div>
                    <ZoomOut />
                  </div>
                  <div>
                    <Zoom />
                  </div>
                  <div>
                    <ZoomIn />
                  </div>
                  <div>
                    <GoToPreviousPage />
                  </div>
                  <div className="flex items-center gap-1">
                    <CurrentPageInput />
                    <NumberOfPages />
                  </div>
                  <div>
                    <GoToNextPage />
                  </div>
                  <div>
                    <EnterFullScreen />
                  </div>
                  <div>
                    <SwitchViewMode mode={ViewMode.DualPage} />
                  </div>
                  <div>
                    <SwitchViewMode mode={ViewMode.SinglePage} />
                  </div>
                </div>
              );
            }}
          </Toolbar>
        </div>
      ) : null}

      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl={src}
          initialPage={initialPage}
          defaultScale={SpecialZoomLevel.PageWidth}
          enableSmoothScroll
          // scrollMode={ScrollMode.Vertical}
          plugins={[toolbarPluginInstance, pageNavigationPluginInstance]}
          pageLayout={pageLayout}
          renderPage={renderPage}
          setRenderRange={render}
          //   withCredentials={false}
          //   localization={lang as unknown as LocalizationMap}
        />
      </Worker>
    </div>
  );
};
