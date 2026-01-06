import React from 'react';
import { LucideIcon } from 'lucide-react';
import ProgressBar from '@/components/form/ProgressBar';
import { StatCardProgress } from "../types/StatCardTypes"

export interface StatCardProps {
  title?: string;
  value?: string;
  subtitle?: string;
  icon: LucideIcon;
  color?: string; 
  gradientClass: string;
  trendIcon?: React.ReactNode; 
  progress?: StatCardProgress;
  description?: string;
  showValueWithProgress?: boolean; 
 
}

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color, 
  trendIcon, 
  gradientClass = "", 
  progress,
  description,
  showValueWithProgress = false,
 }: StatCardProps) => {
  
  // Determine if we should show progress bar
  const hasProgress = progress !== undefined;
  
  // Determine if we should show value text alongside progress
  const shouldShowValueText = showValueWithProgress && hasProgress;

  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md
        border-border
        bg-linear-to-r from-card ${gradientClass} 
        dark:from-card dark:to-card/80
      `}
    >
      
     

      {/* Top Section: Icon and Titles */}
      <div className="relative z-10 flex items-start gap-3">
        {/* Icon Container with subtle background */}
        <div 
          className="flex h-10 w-10 items-center justify-center rounded-full shadow-sm flex-shrink-0" 
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={20} style={{ color: color }} />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Title */}
          <p className="text-[14px] font-medium text-muted mb-1">
            {title}
          </p>
          
          {/* Value - Display differently based on progress */}
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl  flex  items-center justify-center gap-2  text-fg truncate">
              <span className='font-bold'>

              {value}
              </span>
               <span>
                 {description && (
            <p className="text-[8px]">{description}</p>
          )}</span>
            </h3>
            
            {/* Show additional text alongside value if requested */}
            {shouldShowValueText && (
              <span className="text-sm font-semibold text-primary">
                {progress.labelText ? ` (${progress.labelText})` : ` (${Math.round(progress.value || 0)}%)`}
              </span>
            )}
          </div>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-[12px] text-muted mt-1">
              {subtitle}
            </p>
          )}

      {progress && (
  <div className="relative z-10 mt-4">
    <ProgressBar
      value={progress.value}
      max={progress.max}
      trackColor={progress.trackColor}
      progressColor={progress.progressColor}
      height={progress.height}
      borderRadius={progress.borderRadius}
      labelText={progress.labelText}
      showLabel={progress.showLabel && progress.labelPosition !== "top-center"}
      labelPosition={
        progress.labelPosition === "top-center"
          ? "none"
          : progress.labelPosition
      }
    />
  </div>
)}

        </div>
      </div>

      {/* Progress Bar Section - Only shown when progress prop exists */}
      {/* {hasProgress && (
        <div className="relative z-10 mt-4">
          <ProgressBar 
            {...progress}
            // Override label position if top-center is used
            showLabel={progressLabelPosition !== 'top-center'}
            labelPosition={progressLabelPosition === 'top-center' ? 'none' : progressLabelPosition}
          />
        </div>
      )} */}

      {/* Bottom Section: Description & Trend - Only show if no top-center label */}
      {/* {(!hasProgress || progressLabelPosition !== 'top-center') && (
        <div className="relative z-10 mt-4 flex items-center justify-between">
          {description && (
            <span className="text-[12px] text-muted truncate">
              {description}
            </span>
          )}
          {trendIcon && <div className="flex items-center flex-shrink-0">{trendIcon}</div>}
        </div>
      )} */}
    </div>
  );
};

export default StatCard;