import React, { useState, useEffect, useRef } from "react";
// import { DecodedBarcodesResult } from "dynamsoft-barcode-reader";
import { CameraEnhancer, CameraView } from "dynamsoft-camera-enhancer";
import { CapturedResultReceiver, CaptureVisionRouter } from "dynamsoft-capture-vision-router";
import { MultiFrameResultCrossFilter } from "dynamsoft-utility";
import './VideoCapture.css';

function VideoCapture() {
  const uiContainer = useRef(null);
  const resultsContainer = useRef(null);
  const [barcodeResult, setBarcodeResult] = useState(null);
  const pInit = useRef(null);
  const pDestroy = useRef(null);

  const init = async () => {
    try {
      const cameraView = await CameraView.createInstance();
      const cameraEnhancer = await CameraEnhancer.createInstance(cameraView);
      uiContainer.current.innerText = "";
      uiContainer.current.append(cameraView.getUIElement());

      const router = await CaptureVisionRouter.createInstance();
      router.setInput(cameraEnhancer);

      const resultReceiver = new CapturedResultReceiver();
      resultReceiver.onDecodedBarcodesReceived = (result) => {
        if (!result.barcodeResultItems.length) return;
        setBarcodeResult(result.barcodeResultItems[0].text);
        resultsContainer.current.textContent = '';
        for (let item of result.barcodeResultItems) {
          resultsContainer.current.append(
            `${item.formatString}: ${item.text}`,
            document.createElement('br'),
            document.createElement('hr'),
          );
        }
      };
      router.addResultReceiver(resultReceiver);

      const filter = new MultiFrameResultCrossFilter();
      filter.enableResultCrossVerification("barcode", true);
      filter.enableResultDeduplication("barcode", true);
      filter.setDuplicateForgetTime("barcode", 3000);
      await router.addResultFilter(filter);

      await cameraEnhancer.open();
      await router.startCapturing("ReadSingleBarcode");
      
      return {
        cameraView,
        cameraEnhancer,
        router,
      };
    } catch (ex) {
      let errMsg = ex.message || ex;
      console.error(errMsg);
      alert(errMsg);
      throw ex;
    }
  };

  const destroy = async () => {
    if (pInit.current) {
      const { cameraView, cameraEnhancer, router } = await pInit.current;
      router.dispose();
      cameraEnhancer.dispose();
      cameraView.dispose();
    }
  };

  useEffect(() => {
    (async () => {
      if (pDestroy.current) {
        await pDestroy.current;
        pInit.current = init();
      } else {
        pInit.current = init();
      }
    })();

    return () => {
      (async () => {
        await (pDestroy.current = destroy());
        console.log("VideoCapture Component Unmount");
      })();
    };
  }, []);

  return (
    <div>
      <div ref={uiContainer} className="div-ui-container"></div>
      Results:
      <br />
      <div ref={resultsContainer} className="div-results-container"></div>
    </div>
  );
}

export default VideoCapture;
