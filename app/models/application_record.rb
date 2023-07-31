class ApplicationRecord < ActiveRecord::Base
  include CableReady::Updatable

  include CableReady::Broadcaster
  self.abstract_class = true
end
