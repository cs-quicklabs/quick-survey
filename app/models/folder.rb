class Folder < ActiveRecord::Base
  belongs_to :space
  belongs_to :user
  validates_presence_of :title
  has_many :survey_surveys, class_name: "Survey::Survey", foreign_key: "folder_id", dependent: :destroy
end
