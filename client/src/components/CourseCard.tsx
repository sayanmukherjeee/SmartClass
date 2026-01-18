import React from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../types/index';

interface CourseCardProps {
  course: Course;
  variant?: 'default' | 'compact' | 'featured';
}

const CourseCard: React.FC<CourseCardProps> = ({ course, variant = 'default' }) => {
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)} mins`;
    if (hours === 1) return '1 hour';
    return `${hours} hours`;
  };

  if (variant === 'compact') {
    return (
      <Link to={`/courses/${course.slug}`} className="course-card compact">
        <div className="course-thumbnail">
          <img 
            src={course.thumbnail || '/default-course.jpg'} 
            alt={course.title}
          />
          <span className={`level-badge ${getLevelBadgeColor(course.level)}`}>
            {course.level}
          </span>
        </div>
        <div className="course-info">
          <h3 className="course-title">{course.title}</h3>
          <div className="course-meta">
            <span className="duration">
              <i className="fas fa-clock"></i> {formatDuration(course.duration_hours)}
            </span>
            <span className="students">
              <i className="fas fa-users"></i> {course.total_enrollments}
            </span>
          </div>
          <div className="course-price">
            {course.is_free ? (
              <span className="free">Free</span>
            ) : (
              <>
                <span className="current-price">${course.price}</span>
                {course.discount_price && (
                  <span className="original-price">${course.discount_price}</span>
                )}
              </>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="course-card">
      <div className="course-image">
        <img 
          src={course.thumbnail || '/default-course.jpg'} 
          alt={course.title}
        />
        <div className="course-badges">
          <span className={`level-badge ${getLevelBadgeColor(course.level)}`}>
            {course.level}
          </span>
          {course.is_cpd_accredited && (
            <span className="cpd-badge">
              <i className="fas fa-award"></i> CPD
            </span>
          )}
          {course.is_free && (
            <span className="free-badge">Free</span>
          )}
        </div>
        <button className="wishlist-btn">
          <i className="far fa-heart"></i>
        </button>
      </div>
      
      <div className="course-content">
        <div className="course-category">
          <span className="category-badge" style={{ backgroundColor: course.category.color }}>
            {course.category.name}
          </span>
          <div className="rating">
            <i className="fas fa-star"></i>
            <span>{course.average_rating.toFixed(1)}</span>
            <span className="reviews">({course.total_reviews})</span>
          </div>
        </div>
        
        <h3 className="course-title">
          <Link to={`/courses/${course.slug}`}>{course.title}</Link>
        </h3>
        
        <p className="course-description">{course.short_description}</p>
        
        <div className="course-instructor">
          <div className="instructor-avatar">
            <i className="fas fa-user"></i>
          </div>
          <span className="instructor-name">{course.instructor.first_name} {course.instructor.last_name}</span>
        </div>
        
        <div className="course-footer">
          <div className="course-meta">
            <span className="meta-item">
              <i className="fas fa-clock"></i>
              {formatDuration(course.duration_hours)}
            </span>
            <span className="meta-item">
              <i className="fas fa-video"></i>
              {course.subtitles.length} languages
            </span>
            <span className="meta-item">
              <i className="fas fa-users"></i>
              {course.total_enrollments} students
            </span>
          </div>
          
          <div className="course-pricing">
            {course.is_free ? (
              <span className="price-free">Free</span>
            ) : (
              <div className="price-container">
                <span className="price-current">${course.price}</span>
                {course.discount_price && (
                  <span className="price-original">${course.discount_price}</span>
                )}
              </div>
            )}
            <Link to={`/courses/${course.slug}`} className="btn-enroll">
              {course.is_free ? 'Enroll Free' : 'Enroll Now'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;