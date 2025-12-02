module Api
  module V1
    class PetsController < BaseController
      before_action :set_pet, only: %i[ show update destroy ]

      def index
        @pets = Pet.all
        render json: @pets
      end

      def show
        render json: @pet
      end

      def create
        @pet = Pet.new(pet_params)

        if @pet.save
          render json: @pet, status: :created
        else
          render json: { errors: @pet.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @pet.update(pet_params)
          render json: @pet, status: :ok
        else
          render json: { errors: @pet.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @pet.destroy!
        head :no_content
      end

      private

      def set_pet
        @pet = Pet.find(params[:id])
      end

      def pet_params
        params.require(:pet).permit(:pet_type, :breed, :picture, :birthday, :name, :nickname, :date_admitted, :notes, :gender)
      end
    end
  end
end
