import {useContext, useEffect, useRef, useState} from "react";
import styles from '../Tasks.module.css';
import {LessonContext} from "../LessonContext.tsx";
import type {AssistedWritingTaskType} from "../../taskTypes.ts";


function AssistedWritingTask({task}: { task: AssistedWritingTaskType }) {

    const {submitAnswer} = useContext(LessonContext);

    console.log("Task to: " + task.svgPathStrokes)


    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);

    const [progress, setProgress] = useState(0);
    const [activeStrokeIndex, setActiveStrokeIndex] = useState(0);
    const [pathLength, setPathLength] = useState(100);
    const [isDrawing, setIsDrawing] = useState(false);

    const [isTaskCompleted, setIsTaskCompleted] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const TOLERANCE = 5;
    const LOOK_AHEAD = 1;

    useEffect(() => {
        const timer = setTimeout(() => {
            if (pathRef.current) {
                setPathLength(pathRef.current.getTotalLength());
            }
        }, 0)
        return () => clearTimeout(timer);
    }, [task.svgPathStrokes, activeStrokeIndex]);

    const handleMove = (clientX: number, clientY: number) => {
        if (!isDrawing || isTaskCompleted || !svgRef.current || !pathRef.current) return;

        //Przeliczamy współrzędne ekranu (px) na współrzędne wewnątrz SVG (viewBox)
        const pt = svgRef.current.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());

        const potentialProgress = progress + LOOK_AHEAD;

        if (potentialProgress > pathLength) {
            finishDrawing();
            return;
        }

        const pointOnPath = pathRef.current.getPointAtLength(potentialProgress);
        const dist = Math.hypot(svgP.x - pointOnPath.x, svgP.y - pointOnPath.y);

        if (dist < TOLERANCE) {
            setProgress(prev => Math.min(prev + LOOK_AHEAD, pathLength));

            if (progress + LOOK_AHEAD >= pathLength - 5) {
                finishDrawing();
            }
        }
    };

    const finishDrawing = () => {

        setProgress(pathLength);

        if (activeStrokeIndex < task.svgPathStrokes.length - 1) {
            setIsDrawing(false);
            setActiveStrokeIndex(prev => prev + 1);
            setProgress(0);

        } else {

            setIsTaskCompleted(true);
            setIsDrawing(false);
        }
    };

    const handleCheck = () => {
        if (!isTaskCompleted || isSubmitted) return;

        setIsSubmitted(true);
        submitAnswer(true);
    };

    const onMouseDown = () => setIsDrawing(true);
    const onMouseUp = () => setIsDrawing(false);
    const onTouchStart = () => setIsDrawing(true);


    const onTouchMove = (e: React.TouchEvent) => {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        handleMove(e.clientX, e.clientY);
    };

    return (
        <div className={styles.taskContainer}>
            <h2>{task.description}</h2>
            <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '20px'}}>
                Przytrzymaj i podążaj po linii
            </p>

            <div
                className={styles.canvasContainer}
                style={{
                    position: 'relative',
                    width: '300px',
                    height: '300px',
                    margin: '0 auto',
                    touchAction: 'none'
                }}
            >
                <svg
                    ref={svgRef}
                    viewBox={task.viewBox}
                    style={{
                        width: '100%',
                        height: '100%',
                        background: '#f9f9f9',
                        borderRadius: '25px',
                        cursor: 'crosshair',
                        border: isTaskCompleted ? '3px solid #4cae4f' : '1px solid #ddd'
                    }}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                    onMouseMove={onMouseMove}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onMouseUp}
                    onTouchMove={onTouchMove}
                >

                    {task.svgPathStrokes.map((stroke, index) => {

                            //dawne kreski
                            if (index < activeStrokeIndex) {
                                return (
                                    <path
                                        key={index}
                                        d={stroke}
                                        stroke="#4cae4f"
                                        strokeWidth="12"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                );
                            }

                            //przyszłe kreski
                            if (index > activeStrokeIndex) {

                                return (
                                    <path
                                        key={index}
                                        d={stroke}
                                        stroke="#e0e0e0"
                                        strokeWidth="12"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                );
                            }

                            return (

                                <g key={index}>
                                    <path
                                        d={stroke}
                                        stroke="#e0e0e0"
                                        strokeWidth="12"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                    <path
                                        ref={pathRef}
                                        d={stroke}
                                        stroke="none"
                                        fill="none"
                                    />

                                    <path
                                        d={stroke}
                                        stroke="#4cae4f"
                                        strokeWidth="12"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeDasharray={pathLength}
                                        strokeDashoffset={pathLength - progress}
                                        style={{transition: 'stroke-dashoffset 0.05s linear'}}
                                    />
                                </g>


                            )

                        }
                    )}

                    {!isTaskCompleted && pathRef.current && (
                        <circle
                            cx={pathRef.current.getPointAtLength(progress).x}
                            cy={pathRef.current.getPointAtLength(progress).y}
                            r="7"
                            fill="#4cae4f"
                            stroke="#fff"
                            strokeWidth="2"
                            style={{pointerEvents: 'none'}}
                        />
                    )}
                </svg>
            </div>


            <div className={styles.checkButtonContainer}>
                <button
                    className={`${styles.checkButton}`}
                    disabled={!isTaskCompleted || isSubmitted}
                    onClick={handleCheck}
                >
                    {isSubmitted ? 'Sprawdzanie...' : (isTaskCompleted ? 'Zatwierdź' : 'Dokończ rysowanie')}
                </button>
            </div>
        </div>
    );
}

export default AssistedWritingTask;