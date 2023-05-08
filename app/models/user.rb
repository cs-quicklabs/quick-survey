class User < ApplicationRecord
  acts_as_tenant :account
  belongs_to :account
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable, :invitable, :timeoutable, timeout_in: 5.days, invite_for: 2.weeks

  enum permission: [:telephonic_screener, :resume_screener, :interviewer, :hr, :admin, :team_lead]

  validates_presence_of :first_name, :last_name
  Permissions = [
    ["Telephonic Screener", "telephonic_screener"],
    ["Resume Screener", "resume_screener"],
    ["Interviewer", "interviewer"],
    ["HR", "hr"],
    ["Team Lead ", "team_lead"],
    ["Admin", "admin"],
  ]
  has_many :survey_attempts
end
