class Space < ActiveRecord::Base
  acts_as_tenant :account
  belongs_to :user
  has_and_belongs_to_many :users
  has_many :folders, dependent: :destroy
  validates_presence_of :title, :description
  validates :title, length: { maximum: 255 }
  has_many :pinned_spaces, dependent: :destroy
  scope :active, -> { where(archive: false) }
end
