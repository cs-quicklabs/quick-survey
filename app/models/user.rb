class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable, :invitable, :timeoutable, timeout_in: 5.days,invite_for: 2.weeks


         validates_presence_of :first_name, :last_name, :email
         
end
