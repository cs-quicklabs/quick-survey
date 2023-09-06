class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :trackable,
         :recoverable, :rememberable, :validatable, :confirmable, :invitable, :timeoutable, timeout_in: 5.days, invite_for: 2.weeks

  enum role: [:member, :admin, :superadmin]
  validates_presence_of :first_name, :last_name, on: :create

  ROLES = [
    ["Select a role", ""],
    ["Member", "member"],
    ["Admin", "admin"],
    ["Super Admin", "superadmin"],
  ]

  scope :inactive, -> { where(active: false) }
  scope :active, -> { where(active: true) }

  has_many :survey_attempts

  has_many :pinned_spaces, dependent: :destroy
  has_many :pinned, through: :pinned_spaces, source: :space
  has_many :RecentSurveys, :dependent => :destroy
  has_many :recent, through: :RecentSurveys, source: :survey_surveys
  has_and_belongs_to_many :spaces
end
