class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable, :invitable, :timeoutable, timeout_in: 5.days,invite_for: 2.weeks

         enum permission: [:telephonic_screener, :resume_screener, :interviewer, :hr, :admin]
         validates_presence_of :first_name, :last_name
         Permissions = [
    ["Telephonic Screener", "telephonic_screener"],
    ["Resume Screener", "resume_screener"],
    ["Interviewer", "interviewer"],
    ["HR", "hr"],
    ["Admin", "admin"],
  ]
end
