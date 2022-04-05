# https://github.com/rails/rails/issues/43895
Rails.application.config.after_initialize do
  ActiveStorage::DirectUploadsController.class_eval do
    private

    def verified_service_name
      ActiveStorage::Blob.service.name
    end
  end
end
